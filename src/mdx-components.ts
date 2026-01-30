import type { MDXComponents } from 'mdx/types';
import Section from './components/articles/Section.astro';
import ColorBlock from './components/articles/ColorBlock.astro';
import DecisionItem from './components/articles/DecisionItem.astro';

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		Section,
		ColorBlock,
		DecisionItem,
		...components,
	};
}
