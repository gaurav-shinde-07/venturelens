// ============================================
// VentureAI — CSS Module Type Declaration
// Tells TypeScript that CSS files are valid imports
// This is a standard Next.js + TypeScript pattern
// ============================================

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}