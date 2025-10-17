"use client";

import { useEffect, useState } from "react";

import { Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Video } from "@/types/database";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (editingVideo) {
      setYoutubeUrl(editingVideo.youtube_url ?? "");
    } else {
      setYoutubeUrl("");
    }
  }, [editingVideo]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/videos");
      const data = await response.json();

      if (response.ok) {
        setVideos(data.videos ?? []);
      } else {
        toast.error("Failed to fetch videos");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("An error occurred while fetching videos");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!youtubeUrl.trim()) {
      toast.error("YouTube URL is required");
      return;
    }

    try {
      const method = editingVideo ? "PATCH" : "POST";
      const payload = editingVideo ? { id: editingVideo.id, youtube_url: youtubeUrl } : { youtube_url: youtubeUrl };

      const response = await fetch("/api/admin/videos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingVideo ? "Video updated successfully" : "Video created successfully");
        setShowDialog(false);
        setEditingVideo(null);
        setYoutubeUrl("");
        fetchVideos();
      } else {
        toast.error("Failed to save video");
      }
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("An error occurred while saving the video");
    }
  };

  const deleteVideo = async (videoId: string) => {
    try {
      const response = await fetch("/api/admin/videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: videoId }),
      });

      if (response.ok) {
        toast.success("Video deleted successfully");
        fetchVideos();
      } else {
        toast.error("Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("An error occurred while deleting the video");
    }
  };

  const openCreateDialog = () => {
    setEditingVideo(null);
    setYoutubeUrl("");
    setShowDialog(true);
  };

  const openEditDialog = (video: Video) => {
    setEditingVideo(video);
    setShowDialog(true);
  };

  const getVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("v") ?? urlObj.pathname.split("/").pop();
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Videos Management</h1>
          <p className="text-muted-foreground mt-1">Manage YouTube videos for the landing page</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchVideos} variant="outline" size="icon">
            <RefreshCw className="size-4" />
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 size-4" />
            Add Video
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Videos</CardTitle>
          <CardDescription>YouTube videos displayed on the landing page</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin" />
            </div>
          ) : videos.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No videos found</p>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 size-4" />
                Add Your First Video
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>YouTube URL</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => {
                  const videoId = getVideoId(video.youtube_url ?? "");
                  return (
                    <TableRow key={video.id}>
                      <TableCell>
                        {videoId ? (
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt="Video thumbnail"
                            className="h-16 w-28 rounded object-cover"
                          />
                        ) : (
                          <div className="bg-muted flex h-16 w-28 items-center justify-center rounded text-xs">
                            No Preview
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-md truncate">{video.youtube_url}</TableCell>
                      <TableCell>{new Date(video.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(video)}>
                            <Pencil className="size-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="size-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the video.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteVideo(video.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
            <DialogDescription>
              {editingVideo ? "Update the YouTube URL" : "Add a new YouTube video to display"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube URL</Label>
              <Input
                id="youtube_url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>

            {youtubeUrl && getVideoId(youtubeUrl) && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="relative aspect-video w-full overflow-hidden rounded border">
                  <iframe
                    src={`https://www.youtube.com/embed/${getVideoId(youtubeUrl)}`}
                    className="size-full"
                    allowFullScreen
                    title="Video preview"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setEditingVideo(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingVideo ? "Update Video" : "Add Video"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
