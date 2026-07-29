import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const typeColors = {
  trip: 'bg-amber-100 text-amber-700',
  home: 'bg-blue-100 text-blue-700',
  couple: 'bg-pink-100 text-pink-700',
  other: 'bg-slate-100 text-slate-700',
};

export default function GroupCard({ group }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Link
        to={`/groups/${group._id}`}
        className="block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl">
            {group.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-slate-900">{group.name}</h3>
            <p className="text-xs text-slate-500">
              {group.members.length} member{group.members.length !== 1 ? 's' : ''}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${typeColors[group.type]}`}
          >
            {group.type}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}