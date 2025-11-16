'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import {
  addNoteReaction,
  removeNoteReaction,
  addCommentReaction,
  removeCommentReaction,
  addBlogPostReaction,
  removeBlogPostReaction,
} from '@/lib/actions/reactions-actions';

interface ReactionButtonProps {
  type: 'note' | 'comment' | 'blogPost';
  id: string;
  hasReacted?: boolean;
}

export default function ReactionButton({
  type,
  id,
  hasReacted = false,
}: ReactionButtonProps) {
  const [isReacting, setIsReacting] = useState(false);
  const [optimisticHasReacted, setOptimisticHasReacted] = useState(hasReacted);

  const handleClick = async () => {
    setIsReacting(true);

    try {
      let result;
      if (optimisticHasReacted) {
        // Remove reaction
        if (type === 'note') {
          result = await removeNoteReaction(id);
        } else if (type === 'comment') {
          result = await removeCommentReaction(id);
        } else {
          result = await removeBlogPostReaction(id);
        }
      } else {
        // Add reaction
        if (type === 'note') {
          result = await addNoteReaction(id);
        } else if (type === 'comment') {
          result = await addCommentReaction(id);
        } else {
          result = await addBlogPostReaction(id);
        }
      }

      if (result.success) {
        setOptimisticHasReacted(!optimisticHasReacted);
      } else {
        console.error('Reaction action failed:', result.error);
      }
    } catch (error) {
      console.error('Reaction error:', error);
    } finally {
      setIsReacting(false);
    }
  };

  // Determine icon based on user type (would need to check session, but for now use hasReacted as proxy)
  // In a real app, you'd check if the current user is admin
  const icon = optimisticHasReacted ? '⭐' : '❤️';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isReacting}
      className="flex items-center gap-1"
    >
      <span>{icon}</span>
      <span>{optimisticHasReacted ? 'Remove' : 'React'}</span>
    </Button>
  );
}

