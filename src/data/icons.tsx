import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  GraduationCap,
  Code2,
  Server,
  Wrench,
  Globe,
  ExternalLink,
  Briefcase,
  User,
  Award,
  Star,
  Heart,
  Link as LinkIcon,
} from "lucide-react";

export const iconMap: Record<string, any> = {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  GraduationCap,
  Code2,
  Server,
  Wrench,
  Globe,
  ExternalLink,
  Briefcase,
  User,
  Award,
  Star,
  Heart,
  Link: LinkIcon,
};

export const iconNames = Object.keys(iconMap);

export const getIcon = (name: string | null | undefined, fallback: any = Globe) =>
  iconMap[String(name ?? "").trim()] ?? fallback;
