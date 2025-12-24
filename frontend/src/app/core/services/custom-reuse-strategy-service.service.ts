import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CustomReuseStrategyService implements RouteReuseStrategy {
  private static cachedHandles = new Map<string, DetachedRouteHandle>();

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig || future.data['shouldReuse'];
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.data['reuseComponent'];
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (route.routeConfig && route.data['reuseComponent']) {
      CustomReuseStrategyService.cachedHandles.set(route.routeConfig.path!, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (route.routeConfig && route.data['reuseComponent']) {
      return CustomReuseStrategyService.cachedHandles.has(route.routeConfig.path!);
    }
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (route.routeConfig && route.data['reuseComponent']) {
      return CustomReuseStrategyService.cachedHandles.get(route.routeConfig.path!) || null;
    }
    return null;
  }
}
