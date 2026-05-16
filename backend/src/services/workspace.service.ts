import { Workspace } from '../models/Workspace.model.js';
import { WorkspaceMember } from '../models/WorkspaceMember.model.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ActivityService } from './activity.service.js';
import { NotificationService } from './notification.service.js';
import type { WorkspaceRole } from '../types/workspace.types.js';
import { canManageRole } from '../utils/permissions.js';

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50);

export class WorkspaceService {
  static async create(userId: string, data: { name: string; description?: string; color?: string }) {
    const baseSlug = slugify(data.name);
    let slug = baseSlug;
    let counter = 1;
    while (await Workspace.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const workspace = await Workspace.create({
      name: data.name,
      slug,
      description: data.description,
      color: data.color || '#3b82f6',
      ownerId: userId,
    });

    await WorkspaceMember.create({
      workspaceId: workspace._id,
      userId,
      role: 'owner',
    });

    await ActivityService.log(workspace._id, userId, 'created workspace', 'workspace', workspace._id.toString());
    return this.formatWorkspace(workspace, 'owner');
  }

  static async listForUser(userId: string) {
    const memberships = await WorkspaceMember.find({ userId }).lean();
    const workspaceIds = memberships.map((m) => m.workspaceId);
    const workspaces = await Workspace.find({ _id: { $in: workspaceIds } }).lean();

    return workspaces.map((ws) => {
      const membership = memberships.find((m) => m.workspaceId.toString() === ws._id.toString());
      return {
        id: ws._id.toString(),
        name: ws.name,
        slug: ws.slug,
        description: ws.description,
        color: ws.color,
        role: membership?.role,
        settings: ws.settings,
      };
    });
  }

  static async getById(workspaceId: string, userId: string) {
    const member = await WorkspaceMember.findOne({ workspaceId, userId });
    if (!member) throw new ApiError(403, 'Access denied');
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new ApiError(404, 'Workspace not found');
    return this.formatWorkspace(workspace, member.role);
  }

  static async update(workspaceId: string, userId: string, data: Partial<{ name: string; description: string; color: string; settings: object }>) {
    const workspace = await Workspace.findByIdAndUpdate(workspaceId, data, { new: true });
    if (!workspace) throw new ApiError(404, 'Workspace not found');
    await ActivityService.log(workspaceId, userId, 'updated workspace settings', 'workspace', workspaceId);
    const member = await WorkspaceMember.findOne({ workspaceId, userId });
    return this.formatWorkspace(workspace, member!.role);
  }

  static async delete(workspaceId: string) {
    await WorkspaceMember.deleteMany({ workspaceId });
    await Workspace.findByIdAndDelete(workspaceId);
  }

  static async getMembers(workspaceId: string) {
    const members = await WorkspaceMember.find({ workspaceId })
      .populate('userId', 'name email avatar role lastSeenAt')
      .lean();
    return members.map((m) => ({
      id: m._id.toString(),
      userId: (m.userId as { _id: { toString: () => string } })._id?.toString?.() || String(m.userId),
      name: (m.userId as { name?: string }).name,
      email: (m.userId as { email?: string }).email,
      avatar: (m.userId as { avatar?: string }).avatar,
      role: m.role,
      joinedAt: m.joinedAt,
    }));
  }

  static async inviteMember(
    workspaceId: string,
    inviterId: string,
    email: string,
    role: WorkspaceRole = 'member',
  ) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new ApiError(404, 'User not found. They must register first.');

    const existing = await WorkspaceMember.findOne({ workspaceId, userId: user._id });
    if (existing) throw new ApiError(409, 'User is already a member');

    const member = await WorkspaceMember.create({
      workspaceId,
      userId: user._id,
      role,
      invitedBy: inviterId,
    });

    await NotificationService.create({
      userId: user._id.toString(),
      workspaceId,
      type: 'invite',
      title: 'Workspace invitation',
      message: 'You were added to a workspace',
      link: `/dashboard`,
    });

    await ActivityService.log(workspaceId, inviterId, `invited ${email}`, 'member', member._id.toString());
    return member;
  }

  static async updateMemberRole(
    workspaceId: string,
    actorId: string,
    memberId: string,
    newRole: WorkspaceRole,
    actorRole: WorkspaceRole,
  ) {
    const target = await WorkspaceMember.findById(memberId);
    if (!target || target.workspaceId.toString() !== workspaceId) {
      throw new ApiError(404, 'Member not found');
    }
    if (target.role === 'owner') throw new ApiError(400, 'Cannot change owner role');
    if (!canManageRole(actorRole, target.role) || !canManageRole(actorRole, newRole)) {
      throw new ApiError(403, 'Cannot assign this role');
    }
    target.role = newRole;
    await target.save();
    await ActivityService.log(workspaceId, actorId, `changed role to ${newRole}`, 'member', memberId);
    return target;
  }

  static async removeMember(workspaceId: string, actorId: string, memberId: string, actorRole: WorkspaceRole) {
    const target = await WorkspaceMember.findById(memberId);
    if (!target || target.workspaceId.toString() !== workspaceId) {
      throw new ApiError(404, 'Member not found');
    }
    if (target.role === 'owner') throw new ApiError(400, 'Cannot remove owner');
    if (!canManageRole(actorRole, target.role)) throw new ApiError(403, 'Cannot remove this member');
    await target.deleteOne();
    await ActivityService.log(workspaceId, actorId, 'removed member', 'member', memberId);
  }

  private static formatWorkspace(workspace: InstanceType<typeof Workspace>, role: WorkspaceRole) {
    return {
      id: workspace._id.toString(),
      name: workspace.name,
      slug: workspace.slug,
      description: workspace.description,
      color: workspace.color,
      ownerId: workspace.ownerId.toString(),
      settings: workspace.settings,
      role,
    };
  }
}
