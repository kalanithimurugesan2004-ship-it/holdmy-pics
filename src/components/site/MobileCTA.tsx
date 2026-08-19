import { MessageCircle, Instagram } from "lucide-react";

export function MobileCTA() {
  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40 glass rounded-full shadow-soft flex items-center gap-2 p-1.5">
      <a
        href="https://wa.me/917010249422"
        target="_blank"
        rel="noreferrer"
        className="flex-1 flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-3 text-sm font-medium"
      >
        <MessageCircle size={15} /> WhatsApp
      </a>
      <a
        href="https://instagram.com/hold_mypics"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded-full bg-lavender-gradient text-primary-foreground px-5 py-3 text-sm font-medium"
      >
        <Instagram size={15} /> DM
      </a>
    </div>
  );
}