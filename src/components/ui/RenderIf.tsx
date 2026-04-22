import React, { ReactNode, Children, ReactElement, JSX } from 'react';

interface Props {
  when: boolean;
  children: ReactNode;
}

interface RenderElseProps {
  children: ReactNode;
}

// Utility function to check if a child is RenderElse component
const isRenderElse = (child: React.ReactNode): child is ReactElement => {
  return React.isValidElement(child) && 
         typeof child.type === 'function' && 
         'displayName' in child.type &&
         child.type.displayName === 'RenderElse';
};

const RenderIf = ({ children, when }: Props): JSX.Element | null => {
  // Early return for empty children
  if (!children) return null;

  if (when) {
    // Render all children except RenderElse
    const validChildren: React.ReactNode[] = [];
    
    Children.forEach(children, (child) => {
      if (!isRenderElse(child)) {
        validChildren.push(child);
      }
    });
    
    return validChildren.length > 0 ? <>{validChildren}</> : null;
  }
  
  // Find and render only RenderElse content
  let renderElseContent: ReactNode = null;
  
  Children.forEach(children, (child) => {
    if (isRenderElse(child)) {
      renderElseContent = (child as ReactElement<RenderElseProps>).props.children;
    }
  });
  
  return renderElseContent ? <>{renderElseContent}</> : null;
};

const RenderElse = ({ children }: RenderElseProps): null => {
  void children; // To avoid unused variable error since this component never renders directly
  // Component marker - never renders directly
  return null;
};

// Set displayName for identification
RenderElse.displayName = 'RenderElse';

export default RenderIf;
export { RenderElse };