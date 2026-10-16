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
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
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

  const handleCopyLink = (slug: string) => {
    const publicUrl = `${window.location.origin}/form/${slug}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Public form link copied to clipboard!");
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
      <div className="min-h-screen bg-[#faf8f5]">
        <Header viewPage="Dashboard" />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-sm">
            <BarChart2 className="size-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1C2925] tracking-tight">
            Admin Submissions & Analytics Dashboard
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-600">
            Sign in to your makeForm administrator account to track form creation metrics, monitor live submission counts, and inspect respondent entries.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5">
              <Link to="/sign-in">Sign In to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-300">
              <Link to="/create-account">Create Account</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1C2925]">
      <Toaster position="top-right" />
      <Header viewPage="Dashboard" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E2E8E4] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                Admin Console
              </span>
              <span className="text-xs text-gray-500">Live Data</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#1C2925] tracking-tight">
              Submissions & Forms Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back, <span className="font-semibold capitalize">{user?.name}</span>. Manage your forms and inspect incoming submissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboard}
              disabled={isRefreshing}
              className="gap-1.5 border-[#E2E8E4] bg-white text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              asChild
              size="sm"
              className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
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
          <Card className="border-[#E2E8E4] bg-white shadow-sm transition-all hover:shadow-md p-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-900">
                Total Forms Created
              </CardTitle>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                <FileText className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#1C2925]">
                {stats?.totalForms ?? 0}
              </div>
              <p className="my-1 text-xs text-gray-500">
                Created in your workspace
              </p>
            </CardContent>
          </Card>

          {/* Total Submissions Received */}
          <Card className="border-[#E2E8E4] bg-white shadow-sm transition-all hover:shadow-md p-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-900">
                Total Submissions
              </CardTitle>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                <Send className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-blue-900">
                {stats?.totalSubmissions ?? 0}
              </div>
              <p className="my-1 text-xs text-gray-500">
                Responses recorded across all forms
              </p>
            </CardContent>
          </Card>

          {/* Active / Published Forms */}
          <Card className="border-[#E2E8E4] bg-white shadow-sm transition-all hover:shadow-md p-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-900">
                Active Forms
              </CardTitle>
              <div className="rounded-lg bg-green-50 p-2 text-green-700">
                <CheckCircle2 className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-800">
                {stats?.formsByStatus.published ?? 0}
              </div>
              <p className="my-1 text-xs text-gray-500">
                {stats?.formsByStatus.draft ?? 0} draft &bull; {stats?.formsByStatus.closed ?? 0} closed
              </p>
            </CardContent>
          </Card>

          {/* Submission Rate / Avg */}
          <Card className="border-[#E2E8E4] bg-white shadow-sm transition-all hover:shadow-md p-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-900">
                Avg Submissions
              </CardTitle>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                <Sparkles className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-amber-900">
                {stats && stats.totalForms > 0
                  ? (stats.totalSubmissions / stats.totalForms).toFixed(1) : "0.0"}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Average engagement per form
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Layout: Forms List & Submission Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form by Form Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E2E8E4] shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search forms by title, slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-[#FAF9F6] py-2 pl-9 pr-4 text-xs text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-gray-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-[#FAF9F6] px-2.5 py-1.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none"
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
                <Card className="border-dashed border-gray-300 bg-white p-8 text-center">
                  <Inbox className="mx-auto size-10 text-gray-400 mb-2" />
                  <h3 className="text-base font-semibold text-gray-800">
                    {stats?.forms.length === 0 ? "No forms created yet" : "No matching forms found"}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                    {stats?.forms.length === 0
                      ? "Get started by creating your first interactive form in the visual form studio."
                      : "Try adjusting your search query or status filter."}
                  </p>
                  {stats?.forms.length === 0 && (
                    <Button asChild size="sm" className="mt-4 bg-emerald-700 hover:bg-emerald-800 text-white">
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
                      className={`group relative rounded-xl border p-4 bg-white transition-all shadow-sm ${isSelected
                        ? "border-emerald-600 ring-2 ring-emerald-600/20"
                        : "border-[#E2E8E4] hover:border-emerald-300"
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h2 className="font-bold text-base text-[#1C2925] leading-tight group-hover:text-emerald-800 transition-colors">
                              {form.title}
                            </h2>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${form.status === "PUBLISHED"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : form.status === "CLOSED"
                                  ? "bg-red-100 text-red-800 border border-red-300"
                                  : "bg-gray-100 text-gray-700 border border-gray-300"
                                }`}
                            >
                              {form.status}
                            </span>
                          </div>

                          {form.description && (
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {form.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1 font-mono text-[11px] bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                              /{form.slug}
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers className="size-3 text-gray-400" />
                              {form.fieldsCount} {form.fieldsCount === 1 ? "field" : "fields"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3 text-gray-400" />
                              {new Date(form.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Submissions Counter Badge */}
                        <div className="sm:text-right shrink-0 bg-[#faf8f5] sm:bg-transparent p-2 sm:p-0 rounded-lg">
                          <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-2">
                            <span className="text-xs text-gray-500 font-medium sm:hidden">Submissions:</span>
                            <div className="text-xl sm:text-2xl font-black text-emerald-800">
                              {form.submissionsCount}
                            </div>
                            <span className="text-[11px] text-gray-500">
                              {form.submissionsCount === 1 ? "submission" : "submissions"}
                            </span>
                          </div>
                          {stats && stats.totalSubmissions > 0 && (
                            <div className="mt-1 hidden sm:block w-24 ml-auto">
                              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-600 rounded-full"
                                  style={{ width: `${submissionPercent}%` }}
                                />
                              </div>
                              <span className="text-[9px] text-gray-400">
                                {submissionPercent}% of total
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => handleSelectForm(form)}
                            className={`h-7 px-2.5 text-xs font-semibold ${isSelected
                              ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                              : "border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                              }`}
                          >
                            <Eye className="size-3 mr-1" />
                            {isSelected ? "Inspecting Submissions" : "View Submissions"}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyLink(form.slug)}
                            title="Copy public link"
                            className="h-7 px-2 text-xs text-gray-600 hover:text-gray-900"
                          >
                            <Copy className="size-3 mr-1" />
                            Share Link
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(form)}
                            className="h-7 px-2 text-xs text-gray-600 hover:text-gray-900"
                          >
                            {form.status === "PUBLISHED" ? "Close Submissions" : "Publish"}
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/form-builder?id=${form.id}`}
                            className="text-xs font-medium text-gray-500 hover:text-emerald-700 flex items-center gap-0.5"
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
            <Card className="border-[#E2E8E4] bg-white shadow-sm overflow-hidden sticky top-20">
              <CardHeader className="bg-[#FAF9F6] border-b border-[#E2E8E4] pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Inbox className="size-4 text-emerald-700" />
                    <CardTitle className="text-base font-bold text-gray-900">
                      {selectedForm ? `Submissions: ${selectedForm.title}` : "Submission Data Explorer"}
                    </CardTitle>
                  </div>
                  {selectedForm && formResponses.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportCSV}
                      className="h-7 text-xs gap-1 border-gray-300"
                    >
                      <Download className="size-3" />
                      Export CSV
                    </Button>
                  )}
                </div>
                <CardDescription className="text-xs text-gray-500">
                  {selectedForm
                    ? `Showing ${formResponses.length} total entries recorded for this form.`
                    : "Select any form from the list to view its complete submission responses."}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto space-y-3">
                {!selectedForm ? (
                  <div className="py-12 text-center">
                    <BarChart2 className="mx-auto size-12 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-gray-700">No form selected</p>
                    <p className="mt-1 text-xs text-gray-400 max-w-xs mx-auto">
                      Click <span className="font-semibold text-emerald-700">"View Submissions"</span> on any form to inspect submitted values, answers, and timestamps.
                    </p>
                  </div>
                ) : isLoadingResponses ? (
                  <div className="py-12 text-center space-y-2">
                    <RefreshCw className="mx-auto size-6 text-emerald-700 animate-spin" />
                    <p className="text-xs text-gray-500">Fetching submission answers...</p>
                  </div>
                ) : formResponses.length === 0 ? (
                  <div className="py-12 text-center">
                    <Inbox className="mx-auto size-10 text-gray-300 mb-2" />
                    <p className="text-sm font-semibold text-gray-700">No submissions yet</p>
                    <p className="mt-1 text-xs text-gray-400 max-w-xs mx-auto">
                      Share the public link of this form with respondents to start capturing answers.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyLink(selectedForm.slug)}
                      className="mt-4 text-xs gap-1"
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
                          className="rounded-lg border border-gray-200 bg-[#FAF9F6] p-3 text-xs transition-all hover:border-emerald-300"
                        >
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() =>
                              setExpandedResponseId(isExpanded ? null : response.id)
                            }
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                                #{formResponses.length - index}
                              </span>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {new Date(response.submittedAt).toLocaleDateString()} at{" "}
                                  {new Date(response.submittedAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <p className="text-[10px] text-gray-400">
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
                                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                              <div className="text-gray-400">
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
                            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                              <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                                Respondent Answers
                              </p>
                              {response.answers.length === 0 ? (
                                <p className="text-gray-400 italic">No answered fields</p>
                              ) : (
                                <div className="space-y-1.5 divide-y divide-gray-100">
                                  {response.answers.map((ans) => (
                                    <div
                                      key={ans.id || ans.fieldId}
                                      className="pt-1.5 first:pt-0"
                                    >
                                      <p className="font-medium text-gray-700">
                                        {ans.field?.label || `Field (${ans.fieldId})`}
                                      </p>
                                      <p className="mt-0.5 rounded bg-white p-1.5 text-gray-900 border border-gray-200/80 font-mono text-[11px] wrap-break-word">
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
              <Card className="border-[#E2E8E4] bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Clock className="size-4 text-emerald-700" />
                    Recent Submissions Activity
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Latest submissions received across all your forms
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-2">
                  {stats.recentSubmissions.slice(0, 5).map((recent) => (
                    <div
                      key={recent.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-gray-800">{recent.formTitle}</p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(recent.submittedAt).toLocaleDateString()} &bull;{" "}
                          {recent.answers.length} answers
                        </p>
                      </div>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
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
