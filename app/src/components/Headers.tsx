import {
  Eye,
  Home,
  LayoutDashboard,
  LayoutFreeform,
  RotateCcw,
  Redo2,
  Undo2,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import AccountDetails from "./AccountDetails";
import makeFormLogo from "~/assests/makeForm_lightLogo.png";

type HeaderProps = {
  viewPage?: toggleBtn;
  count?: number;
  preview?: boolean;
  onPreview?: () => void;
  onEdit?: () => void;
  onReset?: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
  onRedo?: () => void;
  canRedo?: boolean;
};

export default function Header({
  viewPage,
  count,
  preview,
  onPreview,
  onEdit,
  onReset,
  onUndo,
  canUndo,
  onRedo,
  canRedo,
}: HeaderProps) {
  const { pathname } = useLocation();
  const current =
    viewPage ??
    (pathname === "/dashboard"
      ? "Dashboard"
      : pathname === "/live-preview" || preview
        ? "LivePreview"
        : pathname === "/form-builder"
          ? "FormBuilder"
          : pathname === "/"
            ? "Home"
            : undefined);
  const links = [
    { label: "Home", page: "Home", to: "/" },
    {
      label: "Dashboard",
      page: "Dashboard",
      to: "/dashboard",
    },
    {
      label: "Form Builder",
      page: "FormBuilder",
      to: "/form-builder",
      action: onEdit,
    },
    {
      label: "Live Preview",
      page: "LivePreview",
      to: "/live-preview",
      action: onPreview,
    },
  ];
  const navigation = () =>
    links.map(({ label, page, to, action }) => {
      const active = current === page;
      const className =
        "justify-center rounded-md text-sm transition-colors duration-200 " +
        (active
          ? "bg-transparent hover:bg-transparent hover:text-primary text-[#3525cd]"
          : "hover:bg-transparent text-gray-900 hover:text-gray-500");
      const content = (
        <>
          {label}
          {page === "FormBuilder" && count !== undefined && (
            <span className="rounded bg-primary-fixed px-1.5 text-[10px] font-semibold text-on-primary-fixed">
              {count}
            </span>
          )}
        </>
      );
      return action ? (
        <Button
          key={page}
          variant="ghost"
          className={className}
          aria-pressed={active}
          onClick={() => {
            action();
          }}
        >
          {content}
        </Button>
      ) : (
        <Button key={page} asChild variant="ghost" className={className}>
          <Link
            to={to}
            aria-current={active ? "page" : undefined}
          >
            {content}
          </Link>
        </Button>
      );
    });
  const actions = (
    <>
      {onUndo && (
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo last edit"
          title="Undo last edit"
        >
          <Undo2 className="size-4" />
        </Button>
      )}
      {onRedo && (
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo last edit"
          title="Redo last edit"
        >
          <Redo2 className="size-4" />
        </Button>
      )}
      {onReset && (
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          onClick={onReset}
          aria-label="Reset to template"
          title="Reset to template"
        >
          <RotateCcw className="size-4" />
        </Button>
      )}
      <AccountDetails />
    </>
  );
  return (
    <header
      className={`app-header sticky top-0 z-40 w-full border-b border-[#e1e3e4] bg-white px-3 py-2 backdrop-blur sm:px-5 ${
        pathname === "/" ? "" : "shadow-[0_1px_3px_0_rgba(25,28,29,0.03)]"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex min-h-14 w-full items-center justify-between gap-3 lg:w-[80%]"
      >
        <Link
          to="/"
          className="shrink-0"
          aria-label="makeForm home"
        >
          <img
            className="h-12 w-28 object-contain sm:h-14 sm:w-40"
            src={makeFormLogo}
            alt="makeForm"
          />
        </Link>
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {navigation()}
        </div>
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </nav>
      <div className="mx-auto grid w-full grid-cols-4 gap-1 border-t border-[#e1e3e4] pt-2 lg:hidden">
        {navigation()}
      </div>
    </header>
  );
}
