import { routeFragment, compileFragments } from "route/route_fragment";

export function composeRoutes(builderFunc, {scopeFragments=[], routes={}}={}) {
  builderFunc({
    route: (path, opts) => {
      let fragment = routeFragment(path, opts);
      validateFragmentName(fragment, {type: 'route'});
      let routeName = `${fragment.name}Path`;
      validateNameAvailable(routeName, routes, { scopeFragments });

      routes[routeName] = compileFragments([...scopeFragments, fragment]);
    },

    scope: (path, scopeBody, options) => {
      let fragment = routeFragment(path, { ...options, name: null });
      composeRoutes(scopeBody, { scopeFragments: [...scopeFragments, fragment], routes });
    },

    namedScope: (path, scopeBody, options) => {
      let fragment = routeFragment(path, options);
      validateFragmentName(fragment, {type: 'namedScope'});
      validateNameAvailable(fragment.name, routes, { scopeFragments });

      routes[fragment.name] = composeRoutes(scopeBody, { scopeFragments: [...scopeFragments, fragment], routes: {} });
    }
  });

  return routes;
}

function validateFragmentName(fragment, { type }) {
  if (!fragment.name) {
    throw new Error(
      `Unable to guess ${type}'s name from provided path: "${fragment.path}". ` +
      `Either change it or specify the name explicitly using {name} option.`
    );
  }
}

function validateNameAvailable(name, routes, { scopeFragments }) {
  if (routes[name]) {
    let scopeNames = scopeFragments.map(f => f.name).filter(n => n);
    let fullName = [...scopeNames, name].join('.');

    throw new Error(
      `Attempted to redefine existing route/scope: "${fullName}". ` +
      `Make sure all your route definitions have a unique name.`
    );
  }
}
