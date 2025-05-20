// src/components/shared/PageTitle.tsx
interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function PageTitle({
  title,
  subtitle,
  className,
  icon,
}: PageTitleProps) {
  return (
    <div className={`mb-6 md:mb-8 ${className}`}>
      <div className="flex items-center">
        {icon && <span className="mr-3 text-brand-primary">{icon}</span>}{" "}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-text-primary-light dark:text-text-primary-dark">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="text-sm md:text-base text-text-secondary-light dark:text-text-secondary-dark mt-1 md:mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
