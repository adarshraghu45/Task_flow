import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card, CardDescription, CardHeader, CardTitle } from '@components/ui';

const features = [
  {
    title: 'Task Management',
    description: 'Organize tasks with priorities, due dates, and real-time updates.',
    icon: '✅',
  },
  {
    title: 'Team Collaboration',
    description: 'Assign tasks, comment, and stay in sync with your team via live sockets.',
    icon: '👥',
  },
  {
    title: 'Workflow Automation',
    description: 'Queue background jobs for notifications, reminders, and integrations.',
    icon: '⚡',
  },
];

export const HomePage = () => (
  <div className="container-app py-16">
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl text-center"
    >
      <h1 className="text-4xl font-bold tracking-tight text-content sm:text-5xl lg:text-6xl">
        Manage tasks with{' '}
        <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
          clarity
        </span>
      </h1>
      <p className="mt-6 text-lg text-content-muted">
        TaskFlow Manager is a modern SaaS platform for teams who need powerful task tracking,
        real-time collaboration, and scalable workflows.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link to="/register">
          <Button size="lg">Start free trial</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" size="lg">
            Sign in
          </Button>
        </Link>
      </div>
    </motion.section>

    <section className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <span className="text-3xl">{feature.icon}</span>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </section>
  </div>
);
