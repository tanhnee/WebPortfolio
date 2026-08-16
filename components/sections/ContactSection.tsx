"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send, Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { AnimatedSection } from "@/components/common/AnimatedSection";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().optional(),
  body: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;


interface ContactSectionProps {
  profile?: { email?: string; phone?: string | null; location?: string; linkedinUrl?: string | null; githubUrl?: string | null } | null;
}

export function ContactSection({ profile }: ContactSectionProps) {
  const contactInfo = [
    { icon: Mail, label: "Email", value: profile?.email || "buutanh10032005@gmail.com", href: `mailto:${profile?.email || "buutanh10032005@gmail.com"}` },
    { icon: Phone, label: "Phone", value: profile?.phone || "+84 35 579 2919", href: "tel:+84355792919" },
    { icon: MapPin, label: "Location", value: profile?.location || "Ho Chi Minh City, Vietnam", href: null },
    ...(profile?.linkedinUrl ? [{ icon: Linkedin, label: "LinkedIn", value: profile.linkedinUrl.replace(/^https?:\/\//, ""), href: profile.linkedinUrl }] : []),
    ...(profile?.githubUrl ? [{ icon: Github, label: "GitHub", value: profile.githubUrl.replace(/^https?:\/\//, ""), href: profile.githubUrl }] : []),
  ];
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Message sent successfully! I'll get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Have a project in mind or want to collaborate? Let&apos;s talk!
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <AnimatedSection direction="left" className="lg:col-span-2">
            <div className="glass-card p-6 h-full">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <item.icon size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-sm text-foreground/80 hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-foreground/80">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  🕒 Response time:{" "}
                  <span className="text-foreground font-medium">
                    Within 24 hours
                  </span>
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection direction="right" delay={0.1} className="lg:col-span-3">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Send a Message
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">
                      Name *
                    </label>
                    <input
                      {...register("name")}
                      placeholder="Your name"
                      className="input-dark w-full"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">
                      Email *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="your@email.com"
                      className="input-dark w-full"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Subject
                  </label>
                  <input
                    {...register("subject")}
                    placeholder="What's this about?"
                    className="input-dark w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Message *
                  </label>
                  <textarea
                    {...register("body")}
                    rows={5}
                    placeholder="Tell me about your project or idea..."
                    className="input-dark w-full resize-none"
                  />
                  {errors.body && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.body.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
