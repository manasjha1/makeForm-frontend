import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  FileText,
  Send,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Download,
  Trash2,
  Search,
  Eye,
  RefreshCw,
  Plus,
  AlertCircle,
  Inbox,
  Share2,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  BarChart2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Header from "~/src/components/Headers";
import Footer from "~/src/components/Footer";
import { Button } from "~/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/src/components/ui/card";
import {
  fetchDashboardStats,
  fetchFormResponses,
  deleteFormResponse,
  publishForm,
  closeForm,
  type DashboardStatsResponse,
  type FormStatsSummary,
  type FormResponseItem,
} from "~/src/services/forms";

export function meta() {
  return [
    { title: "Admin Dashboard | makeForm" },
    {
      name: "description",
      content: "Monitor form creations, submissions analytics, and explore response data.",
    },
  ];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id?: string; name: string; email: string } | null>(null);
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Selected form for viewing submission data
  const [selectedForm, setSelectedForm] = useState<FormStatsSummary | null>(null);
  const [formResponses, setFormResponses] = useState<FormResponseItem[]>([]);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const [expandedResponseId, setExpandedResponseId] = useState<string | null>(null);

  // Check auth and load data
  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token || !rawUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(rawUser);
      setUser(parsed);
    } catch {
      setUser(null);
    }

    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err: any) {
      // In case backend is offline or empty, create local empty/fallback state so UI is resilient
      console.warn("Could not load remote dashboard stats:", err?.message);
      setStats({
        totalForms: 0,
        totalSubmissions: 0,
        formsByStatus: { published: 0, draft: 0, closed: 0 },
        forms: [],
        recentSubmissions: [],
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // When a user selects a form to see its submission data
  const handleSelectForm = async (form: FormStatsSummary) => {
    setSelectedForm(form);
    setIsLoadingResponses(true);
    setExpandedResponseId(null);
    try {
      const res = await fetchFormResponses(form.id);
      setFormResponses(res.responses);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load submissions for this form");
      setFormResponses([]);
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const getPublicUrl = (formItem: FormStatsSummary) => {
    const adminId = formItem.userId || user?.id;
    return adminId
      ? `${window.location.origin}/form/${adminId}/${formItem.slug}`
      : `${window.location.origin}/form/${formItem.slug}`;
  };

  const handleCopyLink = (formItem: FormStatsSummary) => {
    const publicUrl = getPublicUrl(formItem);
    navigator.clipboard.writeText(publicUrl);
    toast.success("Public link with your unique Admin ID copied to clipboard!");
  };

  const handleToggleStatus = async (form: FormStatsSummary) => {
    try {
      if (form.status === "PUBLISHED") {
        await closeForm(form.id);
        toast.success(`Form "${form.title}" is now closed.`);
      } else {
        await publishForm(form.id);
        toast.success(`Form "${form.title}" is now published.`);
      }
      loadDashboard();
      if (selectedForm?.id === form.id) {
        setSelectedForm((prev) =>
          prev ? { ...prev, status: prev.status === "PUBLISHED" ? "CLOSED" : "PUBLISHED" } : null
        );
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to change form status");
    }
  };

  const handleDeleteResponse = async (responseId: string) => {
    if (!selectedForm) return;
    if (!confirm("Are you sure you want to permanently delete this submission?")) return;

    try {
      await deleteFormResponse(selectedForm.id, responseId);
      toast.success("Submission deleted successfully");
      setFormResponses((prev) => prev.filter((r) => r.id !== responseId));
      // Refresh stats counters
      loadDashboard();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete submission");
    }
  };

  const handleExportCSV = () => {
    if (!selectedForm || formResponses.length === 0) {
      toast.error("No submissions to export");
      return;
    }

    // Collect all unique field labels across submissions
    const fieldLabels = Array.from(
      new Set(
        formResponses.flatMap((r) =>
          r.answers.map((a) => a.field?.label || a.fieldId)
        )
      )
    );

    const headers = ["Submission ID", "Submitted At", ...fieldLabels];
    const rows = formResponses.map((r) => {
      const answerMap = new Map<string, string>();
      r.answers.forEach((a) => {
        const key = a.field?.label || a.fieldId;
        const val = typeof a.value === "object" ? JSON.stringify(a.value) : String(a.value ?? "");
        answerMap.set(key, `"${val.replace(/"/g, '""')}"`);
      });

      return [
        `"${r.id}"`,
        `"${new Date(r.submittedAt).toLocaleString()}"`,
        ...fieldLabels.map((lbl) => answerMap.get(lbl) || '""'),
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedForm.slug}-submissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Submissions exported as CSV!");
  };

  // Filtered forms based on search and status
  const filteredForms = useMemo(() => {
    if (!stats?.forms) return [];
    return stats.forms.filter((form) => {
      const matchesSearch =
        form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" || form.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [stats?.forms, searchQuery, statusFilter]);

  // If user is not signed in
  if (!user && !isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <Header viewPage="Dashboard" />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e2dfff] text-[#0f0069] shadow-[0_4px_12px_rgba(79,70,229,0.15)]">
            <BarChart2 className="size-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#191c1d] tracking-tight font-heading">
            Admin Submissions &amp; Analytics Dashboard
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-[#464555]">
            Sign in to your makeForm administrator account to track form creation metrics, monitor live submission counts, and inspect respondent entries.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild className="bg-[#3525cd] hover:bg-[#4f46e5] text-white px-6 py-2.5 shadow-[0_4px_14px_0_rgba(79,70,229,0.35)]">
              <Link to="/sign-in">Sign In to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#e1e3e4] hover:bg-[#f3f4f5]">
              <Link to="/create-account">Create Account</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <Toaster position="top-right" />
      <Header viewPage="Dashboard" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#e1e3e4] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#e2dfff] px-2.5 py-0.5 text-xs font-semibold text-[#0f0069] border border-[#c3c0ff]">
                Admin Console
              </span>
              <span className="text-xs text-[#464555]">Live Data</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#191c1d] tracking-tight font-heading">
              Submissions &amp; Forms Dashboard
            </h1>
            <p className="text-sm text-[#464555]">
              Welcome back, <span className="font-semibold capitalize text-[#191c1d]">{user?.name}</span>. Manage your forms and inspect incoming submissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboard}
              disabled={isRefreshing}
              className="gap-1.5 border-[#e1e3e4] bg-white text-[#191c1d] hover:bg-[#f3f4f5] shadow-xs"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              asChild
              size="sm"
              className="gap-1.5 bg-[#3525cd] hover:bg-[#4f46e5] text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.3)]"
            >
              <Link to="/form-builder">
                <Plus className="size-4" />
                Create New Form
              </Link>
            </Button>
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Forms Created */}
          <Card className="border-[#e1e3e4] bg-white shadow-[0_4px_6px_-1px_rgba(25,28,29,0.05),0_2px_4px_-2px_rgba(25,28,29,0.04)] hover:shadow-[0_10px_15px_-3px_rgba(25,28,29,0.08),0_4px_6px_-4px_rgba(25,28,29,0.04)] transition-all p-2 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#191c1d]">
                Total Forms Created
              </CardTitle>
              <div className="rounded-lg bg-[#e2dfff] p-2 text-[#3525cd]">
                <FileText className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#191c1d] font-heading">
                {stats?.totalForms ?? 0}
              </div>
              <p className="my-1 text-xs text-[#464555]">
                Created in your workspace
              </p>
            </CardContent>
          </Card>

          {/* Total Submissions Received */}
          <Card className="border-[#e1e3e4] bg-white shadow-[0_4px_6px_-1px_rgba(25,28,29,0.05),0_2px_4px_-2px_rgba(25,28,29,0.04)] hover:shadow-[0_10px_15px_-3px_rgba(25,28,29,0.08),0_4px_6px_-4px_rgba(25,28,29,0.04)] transition-all p-2 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#191c1d]">
                Total Submissions
              </CardTitle>
              <div className="rounded-lg bg-[#acedff] p-2 text-[#00687a]">
                <Send className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#3525cd] font-heading">
                {stats?.totalSubmissions ?? 0}
              </div>
              <p className="my-1 text-xs text-[#464555]">
                Responses recorded across all forms
              </p>
            </CardContent>
          </Card>

          {/* Active / Published Forms */}
          <Card className="border-[#e1e3e4] bg-white shadow-[0_4px_6px_-1px_rgba(25,28,29,0.05),0_2px_4px_-2px_rgba(25,28,29,0.04)] hover:shadow-[0_10px_15px_-3px_rgba(25,28,29,0.08),0_4px_6px_-4px_rgba(25,28,29,0.04)] transition-all p-2 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#191c1d]">
                Active Forms
              </CardTitle>
              <div className="rounded-lg bg-[#e2dfff] p-2 text-[#0f0069]">
                <CheckCircle2 className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#0f0069] font-heading">
                {stats?.formsByStatus.published ?? 0}
              </div>
              <p className="my-1 text-xs text-[#464555]">
                {stats?.formsByStatus.draft ?? 0} draft &bull; {stats?.formsByStatus.closed ?? 0} closed
              </p>
            </CardContent>
          </Card>

          {/* Submission Rate / Avg */}
          <Card className="border-[#e1e3e4] bg-white shadow-[0_4px_6px_-1px_rgba(25,28,29,0.05),0_2px_4px_-2px_rgba(25,28,29,0.04)] hover:shadow-[0_10px_15px_-3px_rgba(25,28,29,0.08),0_4px_6px_-4px_rgba(25,28,29,0.04)] transition-all p-2 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#191c1d]">
                Avg Submissions
              </CardTitle>
              <div className="rounded-lg bg-[#edeeef] p-2 text-[#191c1d]">
                <Sparkles className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#191c1d] font-heading">
                {stats && stats.totalForms > 0
                  ? (stats.totalSubmissions / stats.totalForms).toFixed(1) : "0.0"}
              </div>
              <p className="mt-1 text-xs text-[#464555]">
                Average engagement per form
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Layout: Forms List & Submission Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form by Form Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#e1e3e4] shadow-[0_2px_4px_0_rgba(25,28,29,0.04)]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-4 text-[#777587]" />
                <input
                  type="text"
                  placeholder="Search forms by title, slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] py-2 pl-9 pr-4 text-xs text-[#191c1d] placeholder-[#777587] focus:border-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-[#464555]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] px-2.5 py-1.5 text-xs text-[#191c1d] focus:border-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20"
                >
                  <option value="ALL">All ({stats?.forms.length ?? 0})</option>
                  <option value="PUBLISHED">Published ({stats?.formsByStatus.published ?? 0})</option>
                  <option value="DRAFT">Draft ({stats?.formsByStatus.draft ?? 0})</option>
                  <option value="CLOSED">Closed ({stats?.formsByStatus.closed ?? 0})</option>
                </select>
              </div>
            </div>

            {/* List of Forms and Submissions Breakdown */}
            <div className="space-y-3">
              {filteredForms.length === 0 ? (
                <Card className="border-dashed border-[#e1e3e4] bg-white p-8 text-center rounded-xl shadow-xs">
                  <Inbox className="mx-auto size-10 text-[#777587] mb-2" />
                  <h3 className="text-base font-semibold text-[#191c1d] font-heading">
                    {stats?.forms.length === 0 ? "No forms created yet" : "No matching forms found"}
                  </h3>
                  <p className="mt-1 text-xs text-[#464555] max-w-sm mx-auto">
                    {stats?.forms.length === 0
                      ? "Get started by creating your first interactive form in the visual form studio."
                      : "Try adjusting your search query or status filter."}
                  </p>
                  {stats?.forms.length === 0 && (
                    <Button asChild size="sm" className="mt-4 bg-[#3525cd] hover:bg-[#4f46e5] text-white shadow-xs">
                      <Link to="/form-builder">Create Form</Link>
                    </Button>
                  )}
                </Card>
              ) : (
                filteredForms.map((form) => {
                  const isSelected = selectedForm?.id === form.id;
                  const submissionPercent =
                    stats && stats.totalSubmissions > 0
                      ? Math.round((form.submissionsCount / stats.totalSubmissions) * 100)
                      : 0;

                  return (
                    <div
                      key={form.id}
                      className={`group relative rounded-xl border p-4 bg-white transition-all ${isSelected
                        ? "border-[#4f46e5] ring-2 ring-[#4f46e5]/25 shadow-[0_10px_15px_-3px_rgba(79,70,229,0.15)]"
                        : "border-[#e1e3e4] shadow-[0_4px_6px_-1px_rgba(25,28,29,0.05),0_2px_4px_-2px_rgba(25,28,29,0.04)] hover:border-[#c7c4d8] hover:shadow-[0_10px_15px_-3px_rgba(25,28,29,0.08),0_4px_6px_-4px_rgba(25,28,29,0.04)]"
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h2 className="font-bold text-base text-[#191c1d] leading-tight group-hover:text-[#3525cd] transition-colors font-heading">
                              {form.title}
                            </h2>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${form.status === "PUBLISHED"
                                ? "bg-[#e2dfff] text-[#0f0069] border border-[#c3c0ff]"
                                : form.status === "CLOSED"
                                  ? "bg-[#ffdad6] text-[#93000a] border border-[#ffb4ab]"
                                  : "bg-[#edeeef] text-[#464555] border border-[#e1e3e4]"
                                }`}
                            >
                              {form.status}
                            </span>
                          </div>

                          {form.description && (
                            <p className="text-xs text-[#464555] line-clamp-1">
                              {form.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#464555]">
                            <span
                              className="flex items-center gap-1 font-mono text-[11px] bg-[#f3f4f5] px-2 py-0.5 rounded border border-[#e1e3e4] text-[#191c1d]"
                              title="Unique Admin-Scoped Path"
                            >
                              /{(form.userId || user?.id) ? `${(form.userId || user?.id)?.slice(0, 8)}.../` : ""}{form.slug}
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers className="size-3 text-[#777587]" />
                              {form.fieldsCount} {form.fieldsCount === 1 ? "field" : "fields"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3 text-[#777587]" />
                              {new Date(form.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Submissions Counter Badge */}
                        <div className="sm:text-right shrink-0 bg-[#f8f9fa] sm:bg-transparent p-2 sm:p-0 rounded-lg">
                          <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-2">
                            <span className="text-xs text-[#464555] font-medium sm:hidden">Submissions:</span>
                            <div className="text-xl sm:text-2xl font-black text-[#3525cd] font-heading">
                              {form.submissionsCount}
                            </div>
                            <span className="text-[11px] text-[#464555]">
                              {form.submissionsCount === 1 ? "submission" : "submissions"}
                            </span>
                          </div>
                          {stats && stats.totalSubmissions > 0 && (
                            <div className="mt-1 hidden sm:block w-24 ml-auto">
                              <div className="h-1.5 w-full bg-[#e1e3e4] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] rounded-full"
                                  style={{ width: `${submissionPercent}%` }}
                                />
                              </div>
                              <span className="text-[9px] text-[#777587]">
                                {submissionPercent}% of total
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-[#f3f4f5] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => handleSelectForm(form)}
                            className={`h-7 px-2.5 text-xs font-semibold ${isSelected
                              ? "bg-[#3525cd] hover:bg-[#4f46e5] text-white shadow-xs"
                              : "border-[#3525cd] text-[#3525cd] hover:bg-[#e2dfff]/40"
                              }`}
                          >
                            <Eye className="size-3 mr-1" />
                            {isSelected ? "Inspecting Submissions" : "View Submissions"}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyLink(form)}
                            title="Copy public link"
                            className="h-7 px-2 text-xs text-[#464555] hover:text-[#191c1d] hover:bg-[#f3f4f5]"
                          >
                            <Copy className="size-3 mr-1" />
                            Share Link
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(form)}
                            className="h-7 px-2 text-xs text-[#464555] hover:text-[#191c1d] hover:bg-[#f3f4f5]"
                          >
                            {form.status === "PUBLISHED" ? "Close Submissions" : "Publish"}
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/form-builder?id=${form.id}`}
                            className="text-xs font-medium text-[#464555] hover:text-[#3525cd] flex items-center gap-0.5"
                          >
                            Edit Form
                            <ChevronRight className="size-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Submission Data Inspector */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-[#e1e3e4] bg-white shadow-[0_10px_25px_-5px_rgba(25,28,29,0.08),0_4px_10px_-3px_rgba(25,28,29,0.04)] overflow-hidden sticky top-20 rounded-xl">
              <CardHeader className="bg-[#f8f9fa] border-b border-[#e1e3e4] pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Inbox className="size-4 text-[#3525cd]" />
                    <CardTitle className="text-base font-bold text-[#191c1d] font-heading">
                      {selectedForm ? `Submissions: ${selectedForm.title}` : "Submission Data Explorer"}
                    </CardTitle>
                  </div>
                  {selectedForm && formResponses.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportCSV}
                      className="h-7 text-xs gap-1 border-[#e1e3e4] bg-white text-[#191c1d] hover:bg-[#f3f4f5] shadow-xs"
                    >
                      <Download className="size-3" />
                      Export CSV
                    </Button>
                  )}
                </div>
                <CardDescription className="text-xs text-[#464555]">
                  {selectedForm
                    ? `Showing ${formResponses.length} total entries recorded for this form.`
                    : "Select any form from the list to view its complete submission responses."}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto space-y-3">
                {!selectedForm ? (
                  <div className="py-12 text-center">
                    <BarChart2 className="mx-auto size-12 text-[#c7c4d8] mb-3" />
                    <p className="text-sm font-semibold text-[#191c1d]">No form selected</p>
                    <p className="mt-1 text-xs text-[#464555] max-w-xs mx-auto">
                      Click <span className="font-semibold text-[#3525cd]">"View Submissions"</span> on any form to inspect submitted values, answers, and timestamps.
                    </p>
                  </div>
                ) : isLoadingResponses ? (
                  <div className="py-12 text-center space-y-2">
                    <RefreshCw className="mx-auto size-6 text-[#3525cd] animate-spin" />
                    <p className="text-xs text-[#464555]">Fetching submission answers...</p>
                  </div>
                ) : formResponses.length === 0 ? (
                  <div className="py-12 text-center">
                    <Inbox className="mx-auto size-10 text-[#c7c4d8] mb-2" />
                    <p className="text-sm font-semibold text-[#191c1d]">No submissions yet</p>
                    <p className="mt-1 text-xs text-[#464555] max-w-xs mx-auto">
                      Share the public link of this form with respondents to start capturing answers.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyLink(selectedForm)}
                      className="mt-4 text-xs gap-1 border-[#e1e3e4] hover:bg-[#f3f4f5]"
                    >
                      <Copy className="size-3" /> Copy Share Link
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formResponses.map((response, index) => {
                      const isExpanded = expandedResponseId === response.id;
                      return (
                        <div
                          key={response.id}
                          className="rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] p-3 text-xs transition-all hover:border-[#c7c4d8] shadow-[0_1px_3px_0_rgba(25,28,29,0.04)]"
                        >
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() =>
                              setExpandedResponseId(isExpanded ? null : response.id)
                            }
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex size-5 items-center justify-center rounded-full bg-[#e2dfff] text-[10px] font-bold text-[#0f0069]">
                                #{formResponses.length - index}
                              </span>
                              <div>
                                <p className="font-semibold text-[#191c1d]">
                                  {new Date(response.submittedAt).toLocaleDateString()} at{" "}
                                  {new Date(response.submittedAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <p className="text-[10px] text-[#777587]">
                                  ID: {response.id.slice(0, 10)}... &bull; {response.answers.length} answers
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteResponse(response.id);
                                }}
                                title="Delete submission"
                                className="text-[#777587] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                              <div className="text-[#777587]">
                                {isExpanded ? (
                                  <ChevronDown className="size-4" />
                                ) : (
                                  <ChevronRight className="size-4" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Answers breakdown table */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-[#e1e3e4] space-y-2">
                              <p className="text-[11px] font-bold text-[#3525cd] uppercase tracking-wider">
                                Respondent Answers
                              </p>
                              {response.answers.length === 0 ? (
                                <p className="text-[#777587] italic">No answered fields</p>
                              ) : (
                                <div className="space-y-1.5 divide-y divide-[#edeeef]">
                                  {response.answers.map((ans) => (
                                    <div
                                      key={ans.id || ans.fieldId}
                                      className="pt-1.5 first:pt-0"
                                    >
                                      <p className="font-medium text-[#191c1d]">
                                        {ans.field?.label || `Field (${ans.fieldId})`}
                                      </p>
                                      <p className="mt-0.5 rounded bg-white p-1.5 text-[#191c1d] border border-[#e1e3e4] font-mono text-[11px] wrap-break-word shadow-xs">
                                        {ans.value === null || ans.value === undefined
                                          ? "-"
                                          : typeof ans.value === "object"
                                            ? JSON.stringify(ans.value, null, 2)
                                            : String(ans.value)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Submissions Feed Across All Forms */}
            {stats && stats.recentSubmissions && stats.recentSubmissions.length > 0 && (
              <Card className="border-[#e1e3e4] bg-white shadow-[0_4px_6px_-1px_rgba(25,28,29,0.05),0_2px_4px_-2px_rgba(25,28,29,0.04)] rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-[#191c1d] flex items-center gap-1.5 font-heading">
                    <Clock className="size-4 text-[#3525cd]" />
                    Recent Submissions Activity
                  </CardTitle>
                  <CardDescription className="text-xs text-[#464555]">
                    Latest submissions received across all your forms
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-2">
                  {stats.recentSubmissions.slice(0, 5).map((recent) => (
                    <div
                      key={recent.id}
                      className="flex items-center justify-between py-2 border-b border-[#f3f4f5] last:border-0 text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-[#191c1d]">{recent.formTitle}</p>
                        <p className="text-[10px] text-[#777587]">
                          {new Date(recent.submittedAt).toLocaleDateString()} &bull;{" "}
                          {recent.answers.length} answers
                        </p>
                      </div>
                      <span className="rounded bg-[#e2dfff] px-2 py-0.5 text-[10px] font-medium text-[#0f0069] border border-[#c3c0ff]">
                        Received
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
