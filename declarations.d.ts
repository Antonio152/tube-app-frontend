// Esta declaración de módulo permite que TypeScript entienda cómo cargar archivos SCSS
declare module "*.scss" {
    const styles: { [className: string]: string };
    export default styles;
  }
  