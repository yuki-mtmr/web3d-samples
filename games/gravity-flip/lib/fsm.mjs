// 軽量 FSM: title/playing/paused/gameover の遷移管理 (principles.md #2)
// 各状態は { enter(from), exit(to), update(dt) } の任意サブセットを持つ。
export function createFSM(states, initial) {
  if (!states || typeof states !== 'object') throw new Error('createFSM: states is required');
  if (!(initial in states)) throw new Error(`createFSM: unknown initial state "${initial}"`);
  let current = initial;
  states[current].enter?.(null);

  return {
    current: () => current,
    is: (name) => current === name,
    transition(to) {
      if (!(to in states)) throw new Error(`fsm: unknown state "${to}"`);
      if (to === current) return;
      const from = current;
      states[from].exit?.(to);
      current = to;
      states[to].enter?.(from);
    },
    update(dt) {
      states[current].update?.(dt);
    },
  };
}
