export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed';
  x: number; // for SVG rendering layout
  y: number; // for SVG rendering layout
}

export const ROADMAPS: Record<string, RoadmapNode[]> = {
  python: [
    { id: 'py-variables', title: 'Variables', description: 'Understand Dynamic Typing, Data Types, and Operators.', status: 'completed', x: 200, y: 50 },
    { id: 'py-io', title: 'Input Output', description: 'Using print(), input(), and formatting strings.', status: 'unlocked', x: 150, y: 150 },
    { id: 'py-conditions', title: 'Conditions', description: 'Conditional flow control using if, elif, and else.', status: 'locked', x: 250, y: 250 },
    { id: 'py-loops', title: 'Loops', description: 'For loops, while loops, range(), and enumerations.', status: 'locked', x: 200, y: 350 },
    { id: 'py-lists', title: 'Lists', description: 'Indexing, slicing, list comprehensions, and methods.', status: 'locked', x: 300, y: 450 },
    { id: 'py-dicts', title: 'Dictionaries & Sets', description: 'Key-value mapping, set operations, and hashing.', status: 'locked', x: 150, y: 550 },
    { id: 'py-functions', title: 'Functions', description: 'Defining functions, *args, **kwargs, and lambdas.', status: 'locked', x: 250, y: 650 },
    { id: 'py-oop', title: 'OOP', description: 'Classes, Objects, inheritance, and dunder methods.', status: 'locked', x: 200, y: 750 },
    { id: 'py-modules', title: 'Modules & Files', description: 'Imports, pip packages, file I/O, and exceptions.', status: 'locked', x: 150, y: 850 },
    { id: 'py-dsa', title: 'DSA in Python', description: 'Stacks, Queues, Trees, and algorithm implementation.', status: 'locked', x: 200, y: 950 }
  ],
  javascript: [
    { id: 'js-variables', title: 'Variables & Scope', description: 'var, let, const, block scope, and primitives.', status: 'completed', x: 200, y: 50 },
    { id: 'js-dom', title: 'DOM Manipulation', description: 'Selecting elements, editing styles, and events.', status: 'unlocked', x: 150, y: 150 },
    { id: 'js-functions', title: 'Functions & Closures', description: 'Arrow functions, parameters, scopes, and closures.', status: 'locked', x: 250, y: 250 },
    { id: 'js-arrays', title: 'Arrays & Methods', description: 'map, filter, reduce, find, slice, and mutate.', status: 'locked', x: 200, y: 350 },
    { id: 'js-objects', title: 'Objects & Prototypes', description: 'Object literals, JSON, prototypical inheritance, and destructuring.', status: 'locked', x: 300, y: 450 },
    { id: 'js-async', title: 'Async Programming', description: 'Callbacks, Promises, async/await, and fetch.', status: 'locked', x: 150, y: 550 },
    { id: 'js-apis', title: 'APIs & LocalStorage', description: 'Handling API calls, request types, and client storage.', status: 'locked', x: 250, y: 650 },
    { id: 'js-react-prep', title: 'React Preparation', description: 'ES6+ features, modules, state logic, and component mindset.', status: 'locked', x: 200, y: 750 }
  ],
  java: [
    { id: 'java-variables', title: 'Variables & Types', description: 'Primitives, objects, type casting, and declaration.', status: 'completed', x: 200, y: 50 },
    { id: 'java-classes', title: 'Classes & Syntax', description: 'Public/private modifiers, class structures, packages.', status: 'unlocked', x: 250, y: 150 },
    { id: 'java-objects', title: 'Objects & Memory', description: 'Reference variables, stack vs heap allocation, and constructors.', status: 'locked', x: 150, y: 250 },
    { id: 'java-oop', title: 'OOP Principles', description: 'Encapsulation, Inheritance, Polymorphism, and Interfaces.', status: 'locked', x: 200, y: 350 },
    { id: 'java-collections', title: 'Collections Framework', description: 'ArrayList, HashMap, LinkedList, and Iterators.', status: 'locked', x: 300, y: 450 },
    { id: 'java-threading', title: 'Multithreading', description: 'Threads, Runnable, synchronized keyword, and concurrency.', status: 'locked', x: 150, y: 550 },
    { id: 'java-dsa', title: 'DSA in Java', description: 'Generic classes, sorting, graphs, and complex trees.', status: 'locked', x: 200, y: 650 }
  ],
  cpp: [
    { id: 'cpp-variables', title: 'Variables & Structs', description: 'Data types, input/output via cin/cout, and structures.', status: 'completed', x: 200, y: 50 },
    { id: 'cpp-pointers', title: 'Pointers', description: 'Memory addresses, dereferencing, and pointer arithmetic.', status: 'unlocked', x: 150, y: 150 },
    { id: 'cpp-references', title: 'References', description: 'Reference variables, pass-by-reference vs value.', status: 'locked', x: 250, y: 250 },
    { id: 'cpp-classes', title: 'Classes & OOP', description: 'Constructors, destructors, encapsulation, and virtual functions.', status: 'locked', x: 200, y: 350 },
    { id: 'cpp-stl', title: 'Standard Template Lib (STL)', description: 'Vectors, lists, maps, pairs, iterators, and algorithms.', status: 'locked', x: 300, y: 450 },
    { id: 'cpp-templates', title: 'Templates', description: 'Function and class templates for generic programming.', status: 'locked', x: 150, y: 550 },
    { id: 'cpp-dsa', title: 'DSA & Manual Memory', description: 'Dynamic allocation (new/delete), heap structures, linked lists.', status: 'locked', x: 200, y: 650 }
  ],
  go: [
    { id: 'go-variables', title: 'Variables & Types', description: 'Declaration syntax, short assignments, zero values.', status: 'completed', x: 200, y: 50 },
    { id: 'go-structs', title: 'Structs & Pointers', description: 'Declaring structs, receivers, and pointer safety.', status: 'unlocked', x: 250, y: 150 },
    { id: 'go-functions', title: 'Functions & Methods', description: 'Multiple return values, named returns, and method sets.', status: 'locked', x: 150, y: 250 },
    { id: 'go-goroutines', title: 'Goroutines', description: 'Concurrent light-weight threads using the "go" keyword.', status: 'locked', x: 200, y: 350 },
    { id: 'go-channels', title: 'Channels', description: 'Channel communication, buffering, and range closures.', status: 'locked', x: 300, y: 450 },
    { id: 'go-concurrency', title: 'Advanced Concurrency', description: 'Select statement, Mutexes, and WaitGroups.', status: 'locked', x: 150, y: 550 },
    { id: 'go-dsa', title: 'Slices & DSA', description: 'Arrays vs slices, maps, and algorithm structures.', status: 'locked', x: 200, y: 650 }
  ]
};
