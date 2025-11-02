import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import SelectDropdown from "./components/select/SelectDropdown";

export default function App() {
  return <MantineProvider theme={theme}>
    <SelectDropdown 
    data={['React', 'Angular', 'Svelte', 'Vue']}/>
  </MantineProvider>;
}
