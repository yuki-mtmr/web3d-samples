// 空間ピッキング(C3 照準・ピッキングクラスタの基盤)。
// 座標変換は純関数(TDD 対象)、raycast は three 注入の薄い adapter に分離。
// meteor-defense の「クリックしても当たらない」疑義(phase1)への恒久対策として、
// C3 は必ずこの pickAt でターゲット判定を行う(自前の座標計算を書かない)。

// client 座標 → NDC(-1..1、y は反転)
export function clientToNdc(clientX, clientY, rect) {
  return {
    x: ((clientX - rect.left) / rect.width) * 2 - 1,
    y: 1 - ((clientY - rect.top) / rect.height) * 2,
  };
}

// three 注入型の picker(adapter、unit test 対象外 — E2E/実プレイで検証)
export function createPicker(THREE, camera, element) {
  const raycaster = new THREE.Raycaster();
  return {
    // 交差した最初のオブジェクトを返す(なければ null)。instanceId 付き。
    pickAt(clientX, clientY, objects) {
      const ndc = clientToNdc(clientX, clientY, element.getBoundingClientRect());
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(objects, false);
      return hits.length > 0 ? hits[0] : null;
    },
  };
}
