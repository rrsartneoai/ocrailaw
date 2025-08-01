
import { Users, Building2, Code, CheckCircle } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Building2,
      value: "500+",
      label: "Kancelarii korzysta",
      color: "text-blue-400"
    },
    {
      icon: Users,
      value: "10K+",
      label: "Prawników obsłużonych",
      color: "text-green-400"
    },
    {
      icon: Code,
      value: "99.9%",
      label: "Dostępność API",
      color: "text-amber-400"
    },
    {
      icon: CheckCircle,
      value: "24/7",
      label: "Wsparcie techniczne",
      color: "text-purple-400"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/50 rounded-2xl mb-4 group-hover:bg-slate-700/50 transition-colors">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
