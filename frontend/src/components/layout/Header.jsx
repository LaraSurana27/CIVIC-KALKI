import { Menu, Bell, Search } from 'lucide-react';

export default function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-civic-surface border-b border-civic-border flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4 flex-1">
        {/* Menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-civic-text-secondary hover:bg-civic-surface-muted transition-colors flex-shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-civic-text-muted pointer-events-none"
            />
            <input
              type="search"
              placeholder="Search events, entities, cases..."
              aria-label="Search"
              className="w-full pl-9 pr-4 py-2 text-sm bg-civic-surface-muted border border-civic-border rounded-lg
                placeholder:text-civic-text-muted text-civic-text
                focus:outline-none focus:ring-2 focus:ring-civic-accent focus:border-transparent
                transition-shadow"
            />
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <button
          className="relative p-2 rounded-lg text-civic-text-secondary hover:bg-civic-surface-muted transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-critical" />
        </button>

        <div
          className="w-8 h-8 rounded-full bg-civic-accent flex items-center justify-center text-white text-xs font-semibold ml-1"
          aria-label="User avatar"
        >
          CK
        </div>
      </div>
    </header>
  );
}
