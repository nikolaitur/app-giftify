import { createGlobalStyle } from 'styled-components';
import _css from '../server/scripttag/partials/_css';
 
const GlobalStyle = createGlobalStyle`
  ${ props => _css(props.config) }
`;
 
export default GlobalStyle;