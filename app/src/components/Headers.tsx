import {
  Eye,
  Home,
  LayoutDashboard,
  LayoutFreeform,
  Menu,
  RotateCcw,
  Redo2,
  Undo2,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import AccountDetails from "./AccountDetails";
import makeFormLogo from "~/assests/makeForm_indigo_logo.png";

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
  const [open, setOpen] = useState(false);
  const { pathname, key } = useLocation();
  const menuId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [key]);
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
  const closeMenu = () => setOpen(false);
  const links = [
    { label: "Home", page: "Home", to: "/", Icon: Home },
    {
      label: "Dashboard",
      page: "Dashboard",
      to: "/dashboard",
      Icon: LayoutDashboard,
    },
    {
      label: "Form Builder",
      page: "FormBuilder",
      to: "/form-builder",
      Icon: LayoutFreeform,
      action: onEdit,
    },
    {
      label: "Live Preview",
      page: "LivePreview",
      to: "/live-preview",
      Icon: Eye,
      action: onPreview,
    },
  ];
  const navigation = () =>
    links.map(({ label, page, to, Icon, action }) => {
      const active = current === page;
      const className =
        "justify-start rounded-md text-xs transition-all duration-200 " +
        (active
          ? "bg-white text-[#3525cd] font-semibold shadow-xs"
          : "text-gray-600 hover:bg-white hover:text-gray-900");
      const content = (
        <>
          <Icon className="size-4" />
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
            closeMenu();
          }}
        >
          {content}
        </Button>
      ) : (
        <Button key={page} asChild variant="ghost" className={className}>
          <Link
            to={to}
            aria-current={active ? "page" : undefined}
            onClick={closeMenu}
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
      <AccountDetails onNavigate={closeMenu} />
    </>
  );
  return (
    <header
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
      className="app-header sticky top-0 z-40 w-full border-b border-[#e1e3e4] bg-white px-3 py-2 backdrop-blur shadow-[0_1px_3px_0_rgba(25,28,29,0.03)] sm:px-5"
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-14 w-full items-center justify-between gap-3 md:w-[80%]"
      >
        <div className="flex items-center justify-between gap-5">
          <Link
            to="/"
            onClick={closeMenu}
            className="shrink-0"
            aria-label="makeForm home"
          >
            <img
              className="h-14 w-32 object-contain"
              src={makeFormLogo}
              alt="makeForm"
            />
          </Link>
          <span className="text-gray-400/80 text-lg mx-3">|</span>
          <div className="hidden items-center gap-1 rounded-lg border border-[#e1e3e4] bg-surface-container-low p-1 shadow-2xs xl:flex">
            {navigation()}
          </div>
        </div>
        <div className="hidden items-center gap-2 xl:flex">{actions}</div>
        <Button
          type="button"
          size="icon"
          variant="outline"
          ref={toggle}
          className="relative xl:hidden transition-all duration-200"
          aria-controls={menuId}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Menu
            className={`absolute size-5 transition-all duration-200 ${open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
          />
          <X
            className={`absolute size-5 transition-all duration-200 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
              }`}
          />
        </Button>
      </nav>
      <div
        id={menuId}
        className={`app-mobile-menu grid overflow-hidden transition-all duration-300 ease-out xl:hidden ${open
          ? "mt-2 max-h-128 border-t border-[#e1e3e4] pt-2 opacity-100"
          : "max-h-0 border-t-0 pt-0 opacity-0"
          }`}
      >
        <div className="grid gap-1">{navigation()}</div>
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[#e1e3e4] pt-2">
          {actions}
        </div>
      </div>
    </header>
  );
}
