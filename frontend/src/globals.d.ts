// This is an interface from @types/node that (unfortunately) adds methods to the global scope
// which aren't supported in the targeted ECMAScript version.
interface RelativeIndexable {
  at: never
}
