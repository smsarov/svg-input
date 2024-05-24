import React from "react";

export function validateChildren(node: React.ReactElement<SVGSVGElement>) {
  if (node.type !== "svg") throw new SyntaxError("child node must be an <svg>");

  // for some reason node.props.children is an array if there are 2 or more elements
  // and plain object otherwise
  if (Array.isArray(node.props.children))
    throw new SyntaxError("child node must have only one child");

  // @ts-ignore because ts thinks node.props.children is an array
  // but we've already checked that it isn't
  if (node.props.children.type !== "path")
    throw new SyntaxError("the child must be <path>");
}
