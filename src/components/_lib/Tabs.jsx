import styled from "styled-components";

const Tabs = styled.nav`
	line-height: 30px;

	/*horizontal scrolling*/
	overflow-y: auto;
	white-space: nowrap;

	/* Chrome, Safari, newer versions of Opera*/
	&::-webkit-scrollbar {
		height: 0 !important;
	}
	/* Firefox */
	overflow: -moz-scrollbars-none;
	/* Internet Explorer +10 */
	-ms-overflow-style: none;

	@media only screen and (min-width: ${({ theme }) => theme.screenDesktopMin}) {
		width: fit-content;
	}

	> * {
		text-align: center;
		color: #999;
		text-decoration: none;
		display: inline-block;
		padding: 8px 8px;
		font-size: 14px;
		font-weight: bold;
		min-width: 60px;
		cursor: pointer;
		user-select: none;
		border-bottom: 2px solid ${({ theme }) => theme.backgroundColor};
		&[aria-current],
		&[data-active] {
			color: ${({ theme }) => theme.tabsTextColor};
			border-bottom: 2px solid ${({ theme }) => theme.tabsTextColor};
		}
	}
`;

export default Tabs;
