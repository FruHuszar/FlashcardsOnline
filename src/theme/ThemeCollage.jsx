import ThemeRegistry from "./ThemeRegistry.js";
import ThemeImage from "./ThemeImage.jsx";

export default function ThemeCollage({ tema, valtozat = "sor" }) {
  return (
    <div className={`theme-collage theme-collage--${valtozat}`} aria-hidden="true">
      {ThemeRegistry.kepek(tema).map((forras, index) => (
        <ThemeImage key={forras} forras={forras} index={index} />
      ))}
    </div>
  );
}
