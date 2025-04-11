export interface CaseType {
  id: string;
  name: string;
  description: string;
  icon?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiredEvidence?: string[];
}

// Predefined case types for the dropdown
export const caseTypes: CaseType[] = [
  {
    id: 'theft',
    name: 'Theft',
    description: 'Report theft or stealing of property without force or violence.',
    severity: 'medium',
    requiredEvidence: ['Description of stolen items', 'Location details', 'Time of incident']
  },
  {
    id: 'burglary',
    name: 'Burglary',
    description: 'Unauthorized entry into a building with intent to commit a crime.',
    severity: 'high',
    requiredEvidence: ['Point of entry', 'Description of stolen items', 'Time of incident']
  },
  {
    id: 'assault',
    name: 'Assault',
    description: 'Physical attack or threat of attack on an individual.',
    severity: 'high',
    requiredEvidence: ['Description of injuries', 'Information about assailant if known']
  },
  {
    id: 'vandalism',
    name: 'Vandalism',
    description: 'Destruction or damage to public or private property.',
    severity: 'medium',
    requiredEvidence: ['Description of damage', 'Photos of damage if possible']
  },
  {
    id: 'fraud',
    name: 'Fraud',
    description: 'Deception for financial or personal gain.',
    severity: 'medium',
    requiredEvidence: ['Evidence of deception', 'Financial records if applicable']
  },
  {
    id: 'traffic_incident',
    name: 'Traffic Incident',
    description: 'Accidents, reckless driving, or traffic violations.',
    severity: 'medium',
    requiredEvidence: ['Vehicle details', 'Location', 'Photos if possible']
  },
  {
    id: 'missing_person',
    name: 'Missing Person',
    description: 'Report a missing or disappeared individual.',
    severity: 'critical',
    requiredEvidence: ['Recent photograph', 'Description of person', 'Last known location']
  },
  {
    id: 'domestic_violence',
    name: 'Domestic Violence',
    description: 'Violence or abuse within a household or family setting.',
    severity: 'critical',
    requiredEvidence: ['Details of incident', 'Description of injuries if applicable']
  },
  {
    id: 'drug_related',
    name: 'Drug Related',
    description: 'Illegal drug possession, sale, or distribution.',
    severity: 'high',
    requiredEvidence: ['Location details', 'Description of activity']
  },
  {
    id: 'cybercrime',
    name: 'Cybercrime',
    description: 'Online fraud, hacking, harassment, or other digital crimes.',
    severity: 'high',
    requiredEvidence: ['Screenshots', 'Digital evidence', 'URLs or account details']
  },
  {
    id: 'public_disturbance',
    name: 'Public Disturbance',
    description: 'Noise complaints, public intoxication, disorderly conduct.',
    severity: 'low',
    requiredEvidence: ['Time and duration', 'Description of disturbance']
  },
  {
    id: 'corruption',
    name: 'Corruption',
    description: 'Abuse of power or bribery by public officials.',
    severity: 'high',
    requiredEvidence: ['Details of incident', 'Involved parties']
  },
  {
    id: 'terrorism',
    name: 'Terrorism Threat',
    description: 'Suspected terrorist activity or threats.',
    severity: 'critical',
    requiredEvidence: ['Detailed description', 'Location details']
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Other crimes or incidents not listed above.',
    severity: 'medium',
    requiredEvidence: ['Detailed description']
  }
];

// Function to get a case type by ID
export function getCaseTypeById(id: string): CaseType | undefined {
  return caseTypes.find(caseType => caseType.id === id);
}

// Function to get severity color
export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
