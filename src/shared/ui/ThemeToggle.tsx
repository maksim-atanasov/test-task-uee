interface Props {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle = ({ isDark, onToggle }: Props) => (
  <button onClick={onToggle}>{isDark ? "Світла тема" : "Темна тема"}</button>
);
