# Jobtracker Kanban Board

## Overview

The Jobtracker is an interactive Kanban-style board that allows users to manage their job search process visually. It provides a modern, Gen-Z friendly interface for tracking job applications through different stages.

## Features

### 🎯 Core Functionality

- **Visual Job Management**: Drag and drop job cards between columns
- **Four Status Columns**:
  - 💾 **Gespeichert** (Saved) - Jobs you're interested in
  - 📤 **Bewerbung** (Applied) - Applications sent
  - 🎯 **Interview** (Interview) - Interview stage
  - 📁 **Archiv** (Archived) - Completed applications

### 🎨 UI/UX Features

- **Gen-Z German Text**: Modern, friendly German language throughout
- **Responsive Design**: Works on desktop and mobile
- **Real-time Feedback**: Toast notifications for actions
- **Loading States**: Skeleton loaders while data loads
- **Empty States**: Encouraging messages when columns are empty

### 🔧 Technical Features

- **Drag & Drop**: Powered by @dnd-kit/core
- **Real-time Updates**: Immediate UI updates with backend sync
- **TypeScript**: Fully typed components and data
- **Modern React**: Uses React 19 with hooks and modern patterns

## Components

### JobtrackerBoard
The main component that manages the entire Kanban board.

### JobColumn
Individual column component with drop zones and job cards.

### JobCard
Draggable job card with company info, status badges, and actions.

### JobCardSkeleton
Loading skeleton for job cards.

### EmptyState
Empty state message for columns with no jobs.

## API Endpoints

### GET /api/jobs
Fetches all jobs for the current user.

### POST /api/jobs
Creates a new job entry.

### PATCH /api/jobs/[id]
Updates a job's status.

## Data Structure

```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  status: 'saved' | 'applied' | 'interview' | 'archived';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
```

## Usage

1. Navigate to the dashboard
2. The Jobtracker board will load with sample data
3. Drag job cards between columns to update their status
4. View job details by clicking the "Details" button
5. See real-time feedback via toast notifications

## Customization

### Adding New Columns
Update the `COLUMNS` array in `jobtracker-board.tsx`:

```typescript
const COLUMNS: JobColumn[] = [
  // ... existing columns
  {
    id: 'new-status',
    title: 'New Status',
    subtitle: 'description',
    emoji: '🎉',
    emptyMessage: 'Empty state message',
  },
];
```

### Modifying Job Cards
Edit the `JobCard` component to add new fields or actions.

### Styling
All components use Tailwind CSS classes and can be customized through the existing design system.

## Future Enhancements

- [ ] Job filtering by location, date, or company
- [ ] Job notes/comments feature
- [ ] Undo functionality after drag operations
- [ ] Bulk operations (move multiple jobs)
- [ ] Job application tracking (dates, follow-ups)
- [ ] Integration with job boards
- [ ] Email notifications for status changes

## Development

The Jobtracker is built with:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- @dnd-kit for drag and drop
- Radix UI components
- Sonner for toast notifications 