export const ELECTRON_RADIUS = 0.16;
export const ELECTRON_COLOR = "#fff2d2";

export function ElectronMesh() {
  return (
    <mesh>
      <sphereGeometry args={[ELECTRON_RADIUS, 12, 12]} />
      <meshBasicMaterial color={ELECTRON_COLOR} />
    </mesh>
  );
}
