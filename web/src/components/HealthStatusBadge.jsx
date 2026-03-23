import React from 'react';
import { Badge } from '@/ui/badge';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const HealthStatusBadge = ({ healthStatus, vaccinationStatus }) => {
  const getHealthConfig = () => {
    switch (healthStatus) {
      case 'healthy':
        return {
          icon: CheckCircle2,
          label: 'Saudável',
          variant: 'default',
          className: 'bg-secondary text-secondary-foreground'
        };
      case 'sick':
        return {
          icon: AlertCircle,
          label: 'Doente',
          variant: 'destructive',
          className: 'bg-destructive text-destructive-foreground'
        };
      case 'recovering':
        return {
          icon: Clock,
          label: 'Em Recuperação',
          variant: 'secondary',
          className: 'bg-accent text-accent-foreground'
        };
      default:
        return {
          icon: AlertCircle,
          label: 'Desconhecido',
          variant: 'outline',
          className: ''
        };
    }
  };

  const config = getHealthConfig();
  const Icon = config.icon;

  return (
    <div className="flex flex-wrap gap-2">
      <Badge className={`gap-1 ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
      {vaccinationStatus && (
        <Badge variant="outline" className="gap-1 border-secondary text-secondary">
          <CheckCircle2 className="w-3 h-3" />
          Vacinado
        </Badge>
      )}
    </div>
  );
};

export default HealthStatusBadge;