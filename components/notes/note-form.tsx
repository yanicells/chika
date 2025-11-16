'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { createNote } from '@/lib/actions/notes-actions';

export default function NoteForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    userName: '',
    color: '#ffffff',
    isPrivate: false,
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.content.trim()) {
      setError('Content is required');
      setIsLoading(false);
      return;
    }

    try {
      const result = await createNote({
        title: formData.title || undefined,
        content: formData.content,
        userName: formData.userName || undefined,
        color: formData.color,
        isPrivate: formData.isPrivate,
        imageUrl: formData.imageUrl || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setFormData({
          title: '',
          content: '',
          userName: '',
          color: '#ffffff',
          isPrivate: false,
          imageUrl: '',
        });
        router.refresh();
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(result.error || 'Failed to create note');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Note form error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Note</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title (optional)"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Enter note title..."
        />

        <Textarea
          label="Content *"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Write your note here..."
          rows={6}
          required
        />

        <Input
          label="Your Name (optional)"
          type="text"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
          placeholder="Anonymous"
        />

        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">
            Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="h-10 w-20 rounded-md border border-gray-300 cursor-pointer"
            />
            <Input
              type="text"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>

        <Input
          label="Image URL (optional)"
          type="url"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
          placeholder="https://example.com/image.jpg"
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            checked={formData.isPrivate}
            onChange={(e) =>
              setFormData({ ...formData, isPrivate: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700">
            Make this note private (admin only)
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">Note created successfully!</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Create Note
        </Button>
      </form>
    </Card>
  );
}

