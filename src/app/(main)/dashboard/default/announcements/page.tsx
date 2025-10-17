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
import type { Announcement } from "@/types/database";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (editingAnnouncement) {
      setMessage(editingAnnouncement.message);
    } else {
      setMessage("");
    }
  }, [editingAnnouncement]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/announcements");
      const data = await response.json();

      if (response.ok) {
        setAnnouncements(data.announcements ?? []);
      } else {
        toast.error("Failed to fetch announcements");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("An error occurred while fetching announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!message.trim()) {
      toast.error("Message is required");
      return;
    }

    try {
      const method = editingAnnouncement ? "PATCH" : "POST";
      const payload = editingAnnouncement ? { id: editingAnnouncement.id, message } : { message };

      const response = await fetch("/api/admin/announcements", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingAnnouncement ? "Announcement updated successfully" : "Announcement created successfully");
        setShowDialog(false);
        setEditingAnnouncement(null);
        setMessage("");
        fetchAnnouncements();
      } else {
        toast.error("Failed to save announcement");
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast.error("An error occurred while saving the announcement");
    }
  };

  const deleteAnnouncement = async (announcementId: string) => {
    try {
      const response = await fetch("/api/admin/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: announcementId }),
      });

      if (response.ok) {
        toast.success("Announcement deleted successfully");
        fetchAnnouncements();
      } else {
        toast.error("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("An error occurred while deleting the announcement");
    }
  };

  const openCreateDialog = () => {
    setEditingAnnouncement(null);
    setMessage("");
    setShowDialog(true);
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowDialog(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements Management</h1>
          <p className="text-muted-foreground mt-1">Manage announcement messages for the landing page</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAnnouncements} variant="outline" size="icon">
            <RefreshCw className="size-4" />
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 size-4" />
            Add Announcement
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
          <CardDescription>Messages displayed in the marquee on the landing page</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No announcements found</p>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 size-4" />
                Add Your First Announcement
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="max-w-md">{announcement.message}</TableCell>
                    <TableCell>{new Date(announcement.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(announcement)}>
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
                                This action cannot be undone. This will permanently delete the announcement.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteAnnouncement(announcement.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}</DialogTitle>
            <DialogDescription>
              {editingAnnouncement ? "Update the announcement message" : "Add a new announcement to display"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                placeholder="Enter announcement message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setEditingAnnouncement(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingAnnouncement ? "Update Announcement" : "Create Announcement"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
