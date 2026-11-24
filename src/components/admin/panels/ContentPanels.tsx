import {
  AdminCard,
  StringListEditor,
  SwitchField,
  TextAreaField,
  TextField,
} from "../AdminUI";
import { EntityListEditor, type FieldDef } from "../EntityEditor";
import { usePortfolio } from "@/data/PortfolioContext";
import type { SectionHeading } from "@/data/portfolio-types";

function SectionCopyFields<T extends SectionHeading & { intro?: string }>({
  heading,
  onChange,
  withIntro = false,
}: {
  heading: T;
  onChange: (next: T) => void;
  withIntro?: boolean;
}) {
  return (
    <div className="mb-6 grid gap-4 border-b border-border/60 pb-6 sm:grid-cols-2">
      <TextField
        label="Section title"
        value={heading.title}
        onChange={(title) => onChange({ ...heading, title })}
      />
      <TextField
        label="Section subtitle"
        value={heading.subtitle}
        onChange={(subtitle) => onChange({ ...heading, subtitle })}
      />
      {withIntro && (
        <div className="sm:col-span-2">
          <TextAreaField
            label="Intro text"
            rows={3}
            value={heading.intro ?? ""}
            onChange={(intro) => onChange({ ...heading, intro } as T)}
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ site */

export function SitePanel() {
  const { data, update } = usePortfolio();
  const { site } = data;
  const set = (patch: Partial<typeof site>) => update((draft) => ({ ...draft, site: { ...draft.site, ...patch } }));

  return (
    <div className="space-y-6">
      <AdminCard
        title="Profile identity"
        description="Used in the header, footer, CV download button and the browser tab."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="First name" value={site.firstName} onChange={(v) => set({ firstName: v })} />
          <TextField label="Last name" value={site.lastName} onChange={(v) => set({ lastName: v })} />
          <TextField
            label="CV file path"
            value={site.cvPath}
            onChange={(v) => set({ cvPath: v })}
            placeholder="/Masood_Abbas.pdf"
            help="Place the file in the public/ folder and reference it from the site root."
          />
        </div>
      </AdminCard>

      <AdminCard title="Search engine & sharing" description="The page title and description used by Google and social previews.">
        <div className="space-y-4">
          <TextField
            label="Page title"
            value={site.siteTitle}
            onChange={(v) => set({ siteTitle: v })}
            help="Shown in the browser tab and as the search result headline."
          />
          <TextAreaField
            label="Meta description"
            rows={3}
            value={site.metaDescription}
            onChange={(v) => set({ metaDescription: v })}
            help="Aim for roughly 150–160 characters."
          />
        </div>
      </AdminCard>
    </div>
  );
}

/* ------------------------------------------------------------ hero */

export function HeroPanel() {
  const { data, update } = usePortfolio();
  const { hero } = data;
  const set = (patch: Partial<typeof hero>) => update((draft) => ({ ...draft, hero: { ...draft.hero, ...patch } }));

  return (
    <div className="space-y-6">
      <AdminCard title="Hero content" description="The first thing visitors see at the top of the page.">
        <div className="space-y-4">
          <TextField
            label="Display name"
            value={hero.name}
            onChange={(v) => set({ name: v })}
            help="Rendered as “Hi, I'm …”."
          />
          <TextAreaField
            label="Tagline"
            rows={3}
            value={hero.description}
            onChange={(v) => set({ description: v })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Badge text" value={hero.badge} onChange={(v) => set({ badge: v })} />
          </div>
          <StringListEditor
            label="Technology tags"
            value={hero.techTags}
            onChange={(techTags) => set({ techTags })}
            placeholder="e.g. React.js"
            addLabel="Add tag"
          />
        </div>
      </AdminCard>

      <AdminCard title="Call-to-action buttons" description="The two buttons under the tagline.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Primary button text" value={hero.ctaText} onChange={(v) => set({ ctaText: v })} />
          <TextField
            label="Primary button link"
            value={hero.ctaHref}
            onChange={(v) => set({ ctaHref: v })}
            placeholder="#contact"
          />
          <TextField
            label="Secondary button text"
            value={hero.secondaryCtaText}
            onChange={(v) => set({ secondaryCtaText: v })}
          />
          <TextField
            label="Secondary button link"
            value={hero.secondaryCtaHref}
            onChange={(v) => set({ secondaryCtaHref: v })}
            placeholder="/Masood_Abbas.pdf"
            help="Point this at your CV file to download it."
          />
        </div>
      </AdminCard>

      <AdminCard title="Visible elements" description="Turn parts of the hero on or off.">
        <div className="grid gap-3 sm:grid-cols-2">
          <SwitchField label="Show badge" checked={hero.showBadge} onChange={(v) => set({ showBadge: v })} />
          <SwitchField
            label="Show tech tags"
            checked={hero.showTechTags}
            onChange={(v) => set({ showTechTags: v })}
          />
          <SwitchField
            label="Show secondary button"
            checked={hero.showSecondaryCta}
            onChange={(v) => set({ showSecondaryCta: v })}
          />
          <SwitchField label="Show social icons" checked={hero.showSocials} onChange={(v) => set({ showSocials: v })} />
        </div>
      </AdminCard>
    </div>
  );
}

/* ----------------------------------------------------------- about */

const aboutDetailFields: FieldDef[] = [
  { key: "label", label: "Label", type: "text", placeholder: "Location", required: true },
  { key: "value", label: "Value", type: "text", placeholder: "Lahore, Punjab" },
  { key: "icon", label: "Icon", type: "icon" },
];

export function AboutPanel() {
  const { data, update } = usePortfolio();
  const { about, sections } = data;
  const setAbout = (patch: Partial<typeof about>) =>
    update((draft) => ({ ...draft, about: { ...draft.about, ...patch } }));

  return (
    <div className="space-y-6">
      <AdminCard title="About section" description="The summary that introduces who you are.">
        <SectionCopyFields
          heading={sections.about}
          onChange={(next) => update((draft) => ({ ...draft, sections: { ...draft.sections, about: next } }))}
        />
        <div className="space-y-4">
          <TextField
            label="Card heading"
            value={about.cardTitle}
            onChange={(v) => setAbout({ cardTitle: v })}
            help="The small heading above your summary paragraphs."
          />
          <StringListEditor
            label="Summary paragraphs"
            multiline
            value={about.paragraphs}
            onChange={(paragraphs) => setAbout({ paragraphs })}
            placeholder="Write a new paragraph…"
            addLabel="Add paragraph"
            emptyText="No summary paragraphs yet."
          />
        </div>
      </AdminCard>

      <EntityListEditor
        title="Quick facts"
        description="The small labelled cards under the summary, e.g. location or email."
        itemNoun="fact"
        items={about.details}
        fields={aboutDetailFields}
        titleKey="label"
        subtitleKey="value"
        createItem={() => ({ icon: "Star", label: "", value: "" })}
        onChange={(details) => setAbout({ details })}
        emptyMessage="No quick facts yet."
      />
    </div>
  );
}

/* ------------------------------------------------------- experience */

const experienceFields: FieldDef[] = [
  { key: "title", label: "Job title", type: "text", placeholder: "Associate Software Engineer", required: true },
  { key: "company", label: "Company", type: "text", placeholder: "Sky IT Services" },
  { key: "period", label: "Period", type: "text", placeholder: "December 2024 - September 2025" },
  { key: "responsibilities", label: "Responsibilities", type: "list", placeholder: "Add a responsibility…" },
];

export function ExperiencePanel() {
  const { data, update } = usePortfolio();
  const { sections, experiences } = data;

  return (
    <div className="space-y-6">
      <AdminCard title="Experience section" description="Section heading shown above your career timeline.">
        <SectionCopyFields
          heading={sections.experience}
          onChange={(next) =>
            update((draft) => ({ ...draft, sections: { ...draft.sections, experience: next } }))
          }
        />
        <p className="text-sm text-muted-foreground">
          {experiences.length} {experiences.length === 1 ? "entry" : "entries"} · newest first looks best.
        </p>
      </AdminCard>

      <EntityListEditor
        title="Work experience"
        description="Add, edit, reorder or delete jobs. Each entry becomes a card on the timeline."
        itemNoun="experience"
        items={experiences}
        fields={experienceFields}
        titleKey="title"
        subtitleKey="company"
        metaLabel={(item) =>
          item.responsibilities?.length ? `${item.responsibilities.length} responsibilities` : null
        }
        createItem={() => ({ title: "", company: "", period: "", responsibilities: [] })}
        onChange={(next) => update((draft) => ({ ...draft, experiences: next }))}
      />
    </div>
  );
}

/* --------------------------------------------------------- projects */

const projectFields: FieldDef[] = [
  { key: "title", label: "Project title", type: "text", placeholder: "E-commerce Website", required: true },
  { key: "category", label: "Category", type: "text", placeholder: "Full Stack Application" },
  { key: "description", label: "Description", type: "textarea", rows: 4, placeholder: "What does it do?" },
  { key: "features", label: "Key features", type: "list", placeholder: "Add a feature…" },
  { key: "technologies", label: "Technologies", type: "list", placeholder: "e.g. React.js" },
  { key: "github", label: "Repository link", type: "url", placeholder: "https://github.com/…" },
  { key: "githubFrontend", label: "Frontend repository", type: "url", placeholder: "https://github.com/…" },
  { key: "githubBackend", label: "Backend repository", type: "url", placeholder: "https://github.com/…" },
];

export function ProjectsPanel() {
  const { data, update } = usePortfolio();
  const { sections, projects } = data;

  return (
    <div className="space-y-6">
      <AdminCard title="Projects section" description="Section heading shown above the project list.">
        <SectionCopyFields
          heading={sections.projects}
          onChange={(next) =>
            update((draft) => ({ ...draft, sections: { ...draft.sections, projects: next } }))
          }
        />
      </AdminCard>

      <EntityListEditor
        title="Projects"
        description="Each project renders as a card with features and technology badges."
        itemNoun="project"
        items={projects}
        fields={projectFields}
        titleKey="title"
        subtitleKey="category"
        metaLabel={(item) => (item.technologies?.length ? `${item.technologies.length} technologies` : null)}
        createItem={() => ({
          title: "",
          category: "",
          description: "",
          features: [],
          technologies: [],
          github: "",
          githubFrontend: "",
          githubBackend: "",
        })}
        onChange={(next) => update((draft) => ({ ...draft, projects: next }))}
        emptyMessage="No projects yet — add your first one."
      />
    </div>
  );
}

/* ----------------------------------------------------------- skills */

const skillFields: FieldDef[] = [
  { key: "title", label: "Category name", type: "text", placeholder: "Frontend", required: true },
  { key: "icon", label: "Icon", type: "icon" },
  { key: "skills", label: "Skills", type: "list", placeholder: "Add a skill…" },
];

export function SkillsPanel() {
  const { data, update } = usePortfolio();
  const { sections, skillCategories } = data;

  return (
    <div className="space-y-6">
      <AdminCard title="Skills section" description="Section heading shown above the skill groups.">
        <SectionCopyFields
          heading={sections.skills}
          onChange={(next) =>
            update((draft) => ({ ...draft, sections: { ...draft.sections, skills: next } }))
          }
        />
      </AdminCard>

      <EntityListEditor
        title="Skill groups"
        description="Group your skills into categories. Each group becomes a card."
        itemNoun="skill group"
        items={skillCategories}
        fields={skillFields}
        titleKey="title"
        metaLabel={(item) => (item.skills?.length ? `${item.skills.length} skills` : null)}
        createItem={() => ({ title: "", icon: "Code2", skills: [] })}
        onChange={(next) => update((draft) => ({ ...draft, skillCategories: next }))}
      />
    </div>
  );
}

/* -------------------------------------------------------- education */

const educationFields: FieldDef[] = [
  { key: "degree", label: "Degree", type: "text", placeholder: "Bachelor of Science in IT", required: true },
  { key: "institution", label: "Institution", type: "text", placeholder: "University of the Punjab" },
  { key: "period", label: "Period", type: "text", placeholder: "Graduated 2024" },
];

export function EducationPanel() {
  const { data, update } = usePortfolio();
  const { about, education } = data;
  const setAbout = (patch: Partial<typeof about>) =>
    update((draft) => ({ ...draft, about: { ...draft.about, ...patch } }));

  return (
    <div className="space-y-6">
      <AdminCard title="Education heading" description="The heading shown above your education list inside the About section.">
        <TextField
          label="Heading"
          value={about.educationTitle}
          onChange={(v) => setAbout({ educationTitle: v })}
        />
      </AdminCard>

      <EntityListEditor
        title="Education"
        description="Degrees, certifications and coursework. Newest first looks best."
        itemNoun="qualification"
        items={education}
        fields={educationFields}
        titleKey="degree"
        subtitleKey="institution"
        metaLabel={(item) => item.period || null}
        createItem={() => ({ degree: "", institution: "", period: "" })}
        onChange={(next) => update((draft) => ({ ...draft, education: next }))}
      />
    </div>
  );
}

/* -------------------------------------------------- socials/contact */

const socialFields: FieldDef[] = [
  { key: "label", label: "Label", type: "text", placeholder: "GitHub", required: true },
  { key: "href", label: "Link", type: "url", placeholder: "https://github.com/your-handle" },
  { key: "icon", label: "Icon", type: "icon" },
];

export function SocialsPanel() {
  const { data, update } = usePortfolio();

  return (
    <EntityListEditor
      title="Social links"
      description="Shown in the hero and footer. Use a mailto: link for email."
      itemNoun="social link"
      items={data.socialLinks}
      fields={socialFields}
      titleKey="label"
      subtitleKey="href"
      createItem={() => ({ icon: "Globe", label: "", href: "" })}
      onChange={(next) => update((draft) => ({ ...draft, socialLinks: next }))}
    />
  );
}

const contactFields: FieldDef[] = [
  { key: "label", label: "Label", type: "text", placeholder: "Email", required: true },
  { key: "value", label: "Displayed value", type: "text", placeholder: "you@example.com" },
  {
    key: "href",
    label: "Link",
    type: "text",
    placeholder: "mailto:you@example.com",
    help: "Leave empty to show plain text instead of a link.",
  },
  { key: "icon", label: "Icon", type: "icon" },
];

export function ContactPanel() {
  const { data, update } = usePortfolio();
  const { sections, contactInfo } = data;

  return (
    <div className="space-y-6">
      <AdminCard title="Contact section" description="Section heading and intro text beside the contact form.">
        <SectionCopyFields
          heading={sections.contact}
          withIntro
          onChange={(next) =>
            update((draft) => ({ ...draft, sections: { ...draft.sections, contact: next } }))
          }
        />
        <p className="text-sm text-muted-foreground">
          The contact form itself is configured in Settings.
        </p>
      </AdminCard>

      <EntityListEditor
        title="Contact details"
        description="The email, phone and location cards shown next to the form."
        itemNoun="contact detail"
        items={contactInfo}
        fields={contactFields}
        titleKey="label"
        subtitleKey="value"
        createItem={() => ({ icon: "Mail", label: "", value: "", href: "" })}
        onChange={(next) => update((draft) => ({ ...draft, contactInfo: next }))}
      />
    </div>
  );
}
