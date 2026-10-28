import CrudPage from "@/components/admin/CrudPage";
import SingletonForm from "./SingletonForm";
import Media from "./Media";
import * as c from "./configs";

export const ProjectsAdmin = () => <CrudPage config={c.projectsConfig} />;
export const SkillsAdmin = () => (
  <div className="space-y-12">
    <CrudPage config={c.skillCategoriesConfig} />
    <CrudPage config={c.skillsConfig} />
  </div>
);
export const ExperienceAdmin = () => <CrudPage config={c.experiencesConfig} />;
export const EducationAdmin = () => <CrudPage config={c.educationConfig} />;
export const CertificationsAdmin = () => <CrudPage config={c.certificationsConfig} />;
export const ServicesAdmin = () => <CrudPage config={c.servicesConfig} />;
export const TestimonialsAdmin = () => <CrudPage config={c.testimonialsConfig} />;
export const BlogAdmin = () => <CrudPage config={c.blogConfig} />;
export const NavigationAdmin = () => <CrudPage config={c.navigationConfig} />;

export const ProfileAdmin = () => (
  <div className="space-y-12">
    <SingletonForm
      table="profile"
      title="Profile"
      description="Your personal info shown in the About and Contact sections."
      fields={[
        { name: "full_name", label: "Full Name", type: "text", required: true },
        { name: "professional_title", label: "Professional Title", type: "text" },
        { name: "tagline", label: "Tagline", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "email", label: "Email", type: "text" },
        { name: "phone", label: "Phone", type: "text" },
        { name: "website", label: "Website", type: "text" },
        { name: "resume_url", label: "CV / Resume URL", type: "text", placeholder: "/Masood_Abbas.pdf" },
        { name: "profile_image_url", label: "Profile Image URL", type: "text" },
        { name: "cover_image_url", label: "Cover Image URL", type: "text" },
        { name: "about", label: "About Me (blank line = new paragraph)", type: "textarea" },
      ]}
    />
    <CrudPage config={c.socialLinksConfig} />
  </div>
);

export const HeroAdmin = () => (
  <SingletonForm
    table="hero"
    title="Hero Section"
    description="The first thing visitors see on your portfolio."
    fields={[
      { name: "badge_text", label: "Badge Text", type: "text", placeholder: "MERN Stack Developer" },
      { name: "heading", label: "Name / Heading", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "tech_tags", label: "Tech Tags", type: "array" },
      { name: "cta_text", label: "Main Button Text", type: "text" },
      { name: "cta_url", label: "Main Button Link", type: "text" },
      { name: "secondary_cta_text", label: "Second Button Text", type: "text" },
      { name: "secondary_cta_url", label: "Second Button Link", type: "text" },
      { name: "show_badge", label: "Show Badge", type: "boolean" },
      { name: "show_tech_tags", label: "Show Tech Tags", type: "boolean" },
      { name: "show_secondary_cta", label: "Show Second Button", type: "boolean" },
      { name: "show_socials", label: "Show Social Icons", type: "boolean" },
    ]}
  />
);

export const SettingsAdmin = () => (
  <SingletonForm
    table="site_settings"
    title="Site Settings"
    description="General, SEO and contact settings."
    fields={[
      { name: "portfolio_name", label: "Portfolio Name", type: "text" },
      { name: "site_title", label: "Site Title", type: "text" },
      { name: "site_description", label: "Site Description", type: "textarea" },
      { name: "meta_title", label: "SEO Meta Title", type: "text" },
      { name: "keywords", label: "SEO Keywords", type: "text" },
      { name: "meta_description", label: "SEO Meta Description", type: "textarea" },
      { name: "contact_email", label: "Contact Email", type: "text" },
      { name: "contact_phone", label: "Contact Phone", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "google_maps_url", label: "Google Maps URL", type: "text" },
      { name: "animations_enabled", label: "Enable Animations", type: "boolean" },
    ]}
  />
);

export const MediaAdmin = () => <Media />;
