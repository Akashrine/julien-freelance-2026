import type { MDXComponents } from 'mdx/types';
import Section from './components/articles/Section.astro';
import SectionIntro from './components/articles/SectionIntro.astro';
import ColorBlock from './components/articles/ColorBlock.astro';
import DecisionItem from './components/articles/DecisionItem.astro';
import ClosingBlock from './components/articles/ClosingBlock.astro';
import SidebarBox from './components/articles/SidebarBox.astro';
import PillarCard from './components/articles/PillarCard.astro';
import Callout from './components/articles/Callout.astro';
import KeyPoint from './components/articles/KeyPoint.astro';
import CodeBlock from './components/articles/CodeBlock.astro';

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		Section,
		SectionIntro,
		ColorBlock,
		DecisionItem,
		ClosingBlock,
		SidebarBox,
		PillarCard,
		Callout,
		KeyPoint,
		CodeBlock,
		...components,
	};
}
