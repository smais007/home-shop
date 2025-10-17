"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { CalendarIcon, Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Countdown } from "@/types/database";

export default function CountdownsPage() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCountdown, setEditingCountdown] = useState<Countdown | null>(null);
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    fetchCountdowns();
  }, []);

  useEffect(() => {
    if (editingCountdown) {
      setTitle(editingCountdown.title);
      setEndDate(new Date(editingCountdown.end_date));
    } else {
      setTitle("");
      setEndDate(undefined);
    }
  }, [editingCountdown]);

  const fetchCountdowns = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/countdowns");
      const data = await response.json();

      if (response.ok) {
        setCountdowns(data.countdowns ?? []);
      } else {
        toast.error("Failed to fetch countdowns");
      }
    } catch (error) {
      console.error("Error fetching countdowns:", error);
      toast.error("An error occurred while fetching countdowns");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !endDate) {
      toast.error("Title and end date are required");
      return;
    }

    try {
      const method = editingCountdown ? "PATCH" : "POST";
      const payload = editingCountdown
        ? { id: editingCountdown.id, title, end_date: endDate.toISOString() }
        : { title, end_date: endDate.toISOString() };

      const response = await fetch("/api/admin/countdowns", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingCountdown ? "Countdown updated successfully" : "Countdown created successfully");
        setShowDialog(false);
        setEditingCountdown(null);
        setTitle("");
        setEndDate(undefined);
        fetchCountdowns();
      } else {
        toast.error("Failed to save countdown");
      }
    } catch (error) {
      console.error("Error saving countdown:", error);
      toast.error("An error occurred while saving the countdown");
    }
  };

  const deleteCountdown = async (countdownId: string) => {
    try {
      const response = await fetch("/api/admin/countdowns", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: countdownId }),
      });

      if (response.ok) {
        toast.success("Countdown deleted successfully");
        fetchCountdowns();
      } else {
        toast.error("Failed to delete countdown");
      }
    } catch (error) {
      console.error("Error deleting countdown:", error);
      toast.error("An error occurred while deleting the countdown");
    }
  };

  const openCreateDialog = () => {
    setEditingCountdown(null);
    setTitle("");
    setEndDate(undefined);
    setShowDialog(true);
  };

  const openEditDialog = (countdown: Countdown) => {
    setEditingCountdown(countdown);
    setShowDialog(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Countdowns Management</h1>
          <p className="text-muted-foreground mt-1">Manage countdown timers for the landing page</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchCountdowns} variant="outline" size="icon">
            <RefreshCw className="size-4" />
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 size-4" />
            Add Countdown
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Countdowns</CardTitle>
          <CardDescription>Countdown timers displayed on the landing page</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin" />
            </div>
          ) : countdowns.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No countdowns found</p>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 size-4" />
                Add Your First Countdown
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countdowns.map((countdown) => (
                  <TableRow key={countdown.id}>
                    <TableCell>{countdown.title}</TableCell>
                    <TableCell>{new Date(countdown.end_date).toLocaleString()}</TableCell>
                    <TableCell>{new Date(countdown.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(countdown)}>
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
                                This action cannot be undone. This will permanently delete the countdown.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCountdown(countdown.id)}>
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
            <DialogTitle>{editingCountdown ? "Edit Countdown" : "Create New Countdown"}</DialogTitle>
            <DialogDescription>
              {editingCountdown ? "Update the countdown timer" : "Add a new countdown timer to display"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter countdown title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setEditingCountdown(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingCountdown ? "Update Countdown" : "Create Countdown"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
