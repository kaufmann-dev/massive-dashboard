import { resolve } from '$app/paths';
import type { ResolvedPathname } from '$app/types';

export function resolveHref(path: string): ResolvedPathname {
	return (resolve as unknown as (path: string) => ResolvedPathname)(path);
}
