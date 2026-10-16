import type { CrudConfig } from "@/components/admin/CrudPage";

export const projectsConfig: CrudConfig = {
  table: "projects",
  title: "Projects",
  singular: "Project",
  searchColumn: "title",
  orderBy: "display_order",
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "my-project" },
    { name: "short_description", label: "Short Description", type: "text" },
    { name: "category", label: "Category", type: "text", placeholder: "Full Stack Application" },
    { name: "full_description", label: "Full Description", type: "textarea", hideInTable: true },
    { name: "features", label: "Key Features", type: "array", hideInTable: true, placeholder: "Feature one, Feature two" },
    { name: "technologies", label: "Technologies", type: "array", hideInTable: true, placeholder: "React.js, Node.js, MongoDB" },
    { name: "featured_image_url", label: "Featured Image URL", type: "text", hideInTable: true },
    { name: "client", label: "Client", type: "text", hideInTable: true },
    { name: "project_url", label: "Live URL", type: "text", hideInTable: true },
    { name: "github_url", label: "GitHub URL", type: "text", hideInTable: true },
    { name: "github_backend_url", label: "GitHub Backend URL", type: "text", hideInTable: true },
    { name: "start_date", label: "Start Date", type: "date", hideInTable: true },
    { name: "end_date", label: "End Date", type: "date", hideInTable: true },
    { name: "status", label: "Status", type: "select", options: [
      { value: "completed", label: "Completed" },
      { value: "in_progress", label: "In Progress" },
      { value: "planned", label: "Planned" },
    ] },
    { name: "is_featured", label: "Featured", type: "boolean" },
    { name: "is_published", label: "Published", type: "boolean" },
    { name: "display_order", label: "Display Order", type: "number" },
  ],
};

export const skillsConfig: CrudConfig = {
  table: "skills",
  title: "Skills",
  singular: "Skill",
  searchColumn: "name",
  orderBy: "display_order",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "category_id", label: "Category ID", type: "text", placeholder: "Optional category UUID", hideInTable: true },
    { name: "icon", label: "Icon", type: "text", hideInTable: true },
    { name: "proficiency", label: "Proficiency", type: "select", options: [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
      { value: "expert", label: "Expert" },
    ] },
    { name: "percentage", label: "Percentage", type: "number" },
    { name: "years_experience", label: "Years of Experience", type: "number", hideInTable: true },
    { name: "display_order", label: "Display Order", type: "number" },
    { name: "is_active", label: "Active", type: "boolean" },
  ],
};

export const skillCategoriesConfig: CrudConfig = {
  table: "skill_categories",
  title: "Skill Categories",
  singular: "Category",
  searchColumn: "name",
  orderBy: "display_order",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "icon", label: "Icon", type: "text", placeholder: "Code2, Server, Wrench" },
    { name: "display_order", label: "Display Order", type: "number" },
  ],
};

export const experiencesConfig: CrudConfig = {
  table: "experiences",
  title: "Experience",
  singular: "Experience",
  searchColumn: "job_title",
  orderBy: "display_order",
  fields: [
    { name: "job_title", label: "Job Title", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "company_logo_url", label: "Company Logo URL", type: "text", hideInTable: true },
    { name: "location", label: "Location", type: "text" },
    { name: "employment_type", label: "Employment Type", type: "select", options: [
      { value: "full_time", label: "Full Time" },
      { value: "part_time", label: "Part Time" },
      { value: "contract", label: "Contract" },
      { value: "internship", label: "Internship" },
      { value: "freelance", label: "Freelance" },
    ] },
    { name: "start_date", label: "Start Date", type: "date" },
    { name: "end_date", label: "End Date", type: "date" },
    { name: "is_current", label: "Currently Working Here", type: "boolean" },
    { name: "description", label: "Description", type: "textarea", hideInTable: true },
    { name: "responsibilities", label: "Responsibilities", type: "array", hideInTable: true },
    { name: "technologies", label: "Technologies Used", type: "array", hideInTable: true },
    { name: "display_order", label: "Display Order", type: "number" },
    { name: "is_published", label: "Published", type: "boolean" },
  ],
};

export const educationConfig: CrudConfig = {
  table: "education",
  title: "Education",
  singular: "Education",
  searchColumn: "degree",
  orderBy: "display_order",
  fields: [
    { name: "degree", label: "Degree", type: "text", required: true },
    { name: "institution", label: "Institution", type: "text", required: true },
    { name: "institution_logo_url", label: "Institution Logo URL", type: "text", hideInTable: true },
    { name: "field_of_study", label: "Field of Study", type: "text" },
    { name: "start_date", label: "Start Date", type: "date" },
    { name: "end_date", label: "End Date", type: "date" },
    { name: "is_current", label: "Currently Studying", type: "boolean" },
    { name: "grade", label: "Grade / GPA", type: "text" },
    { name: "certificate_url", label: "Certificate URL", type: "text", hideInTable: true },
    { name: "description", label: "Description", type: "textarea", hideInTable: true },
    { name: "display_order", label: "Display Order", type: "number" },
    { name: "is_published", label: "Published", type: "boolean" },
  ],
};

export const certificationsConfig: CrudConfig = {
  table: "certifications",
  title: "Certifications",
  singular: "Certification",
  searchColumn: "name",
  orderBy: "display_order",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "organization", label: "Issuing Organization", type: "text", required: true },
    { name: "organization_logo_url", label: "Organization Logo URL", type: "text", hideInTable: true },
    { name: "issue_date", label: "Issue Date", type: "date" },
    { name: "expiration_date", label: "Expiration Date", type: "date" },
    { name: "credential_id", label: "Credential ID", type: "text", hideInTable: true },
    { name: "credential_url", label: "Credential URL", type: "text", hideInTable: true },
    { name: "certificate_file_url", label: "Certificate File URL", type: "text", hideInTable: true },
    { name: "description", label: "Description", type: "textarea", hideInTable: true },
    { name: "display_order", label: "Display Order", type: "number" },
    { name: "is_published", label: "Published", type: "boolean" },
  ],
};

export const servicesConfig: CrudConfig = {
  table: "services",
  title: "Services",
  singular: "Service",
  searchColumn: "name",
  orderBy: "display_order",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "icon", label: "Icon", type: "text" },
    { name: "short_description", label: "Short Description", type: "text" },
    { name: "full_description", label: "Full Description", type: "textarea", hideInTable: true },
    { name: "features", label: "Features", type: "array", hideInTable: true },
    { name: "display_order", label: "Display Order", type: "number" },
    { name: "is_active", label: "Active", type: "boolean" },
  ],
};

export const testimonialsConfig: CrudConfig = {
  table: "testimonials",
  title: "Testimonials",
  singular: "Testimonial",
  searchColumn: "client_name",
  orderBy: "display_order",
  fields: [
    { name: "client_name", label: "Client Name", type: "text", required: true },
    { name: "client_photo_url", label: "Client Photo URL", type: "text", hideInTable: true },
    { name: "job_title", label: "Job Title", type: "text" },
    { name: "company", label: "Company", type: "text" },
    { name: "testimonial", label: "Testimonial", type: "textarea", required: true, hideInTable: true },
    { name: "rating", label: "Rating (1-5)", type: "number" },
    { name: "display_order", label: "Display Order", type: "number" },
    { name: "is_published", label: "Published", type: "boolean" },
  ],
};

export const blogConfig: CrudConfig = {
  table: "blog_posts",
  title: "Blog Posts",
  singular: "Post",
  searchColumn: "title",
  orderBy: "created_at",
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "excerpt", label: "Excerpt", type: "textarea", hideInTable: true },
    { name: "content", label: "Content", type: "textarea", hideInTable: true },
    { name: "featured_image_url", label: "Featured Image URL", type: "text", hideInTable: true },
    { name: "category", label: "Category", type: "text" },
    { name: "tags", label: "Tags", type: "array", hideInTable: true },
    { name: "author", label: "Author", type: "text" },
    { name: "published_at", label: "Publish Date", type: "date" },
    { name: "seo_title", label: "SEO Title", type: "text", hideInTable: true },
    { name: "seo_description", label: "SEO Description", type: "textarea", hideInTable: true },
    { name: "keywords", label: "SEO Keywords", type: "text", hideInTable: true },
    { name: "is_published", label: "Published", type: "boolean" },
  ],
};

export const navigationConfig: CrudConfig = {
  table: "navigation_items",
  title: "Navigation",
  singular: "Nav Item",
  searchColumn: "label",
  orderBy: "display_order",
  fields: [
    { name: "label", label: "Label", type: "text", required: true },
    { name: "url", label: "URL", type: "text", required: true, placeholder: "#about or https://..." },
    { name: "is_external", label: "External Link", type: "boolean" },
    { name: "open_in_new_tab", label: "Open in New Tab", type: "boolean" },
    { name: "display_order", label: "Display Order", type: "number" },
    { name: "is_active", label: "Active", type: "boolean" },
  ],
};

export const socialLinksConfig: CrudConfig = {
  table: "social_links",
  title: "Social Links",
  singular: "Social Link",
  searchColumn: "platform",
  orderBy: "display_order",
  fields: [
    { name: "platform", label: "Platform", type: "text", required: true, placeholder: "GitHub, LinkedIn, Twitter/X" },
    { name: "url", label: "URL", type: "text", required: true },
    { name: "icon", label: "Icon", type: "text", placeholder: "Github, Linkedin, Mail" },
    { name: "display_order", label: "Display Order", type: "number" },
    { name: "is_active", label: "Active", type: "boolean" },
  ],
};
