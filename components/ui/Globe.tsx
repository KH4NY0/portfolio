"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3, MeshPhongMaterialParameters } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Object3DNode, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 250;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

const defaultProps = {
  pointSize: 1,
  showAtmosphere: true,
  atmosphereColor: "#ffffff",
  atmosphereAltitude: 0.1,
  polygonColor: "#ffffff",
  globeColor: "#1b1b1b",
  emissive: "#000000",
  emissiveIntensity: 0.1,
  shininess: 0.9,
} as const;

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings: number[] = [];

// Add check for window object
const isBrowser = typeof window !== "undefined";

type ObjAccessor<T> = T | ((obj: any) => T);

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [globeData, setGlobeData] = useState<any[]>([]);

  // Initialize client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Build data and material when component mounts
  useEffect(() => {
    if (!isClient || !globeRef.current) return;

    const _buildData = () => {
      const arcs = data;
      let points = [];
      for (let i = 0; i < arcs.length; i++) {
        const arc = arcs[i];
        const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
        points.push({
          size: defaultProps.pointSize,
          order: arc.order,
          color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
          lat: arc.startLat,
          lng: arc.startLng,
        });
        points.push({
          size: defaultProps.pointSize,
          order: arc.order,
          color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
          lat: arc.endLat,
          lng: arc.endLng,
        });
      }

      // remove duplicates for same lat and lng
      const filteredPoints = points.filter(
        (v, i, a) =>
          a.findIndex((v2) =>
            ["lat", "lng"].every(
              (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
            )
          ) === i
      );

      setGlobeData(filteredPoints);
    };

    const _buildMaterial = () => {
      // Your material building logic here
    };

    _buildData();
    _buildMaterial();
  }, [isClient, data]);

  // Setup globe configuration
  useEffect(() => {
    if (!isClient || !globeRef.current || !globeData) return;

    globeRef.current
      .globeMaterial({
        emissive: defaultProps.emissive,
        emissiveIntensity: defaultProps.emissiveIntensity,
        shininess: defaultProps.shininess,
        color: defaultProps.globeColor,
      } as any)
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    // startAnimation();
  }, [isClient, globeData]);

  if (!isClient) {
    return null;
  }

  return (
    <threeGlobe
      ref={globeRef}
      globeImageUrl={"//unpkg.com/three-globe/example/img/earth-night.jpg" as unknown as { (): string | null; (url: string): ThreeGlobe }}
      pointsData={globeData as any}
      pointAltitude={(() => 0) as any}
      pointColor={((d: any) => d.color) as unknown as { (): ObjAccessor<string>; (colorAccessor: ObjAccessor<string>): ThreeGlobe }}
      pointsMerge={true as unknown as { (): boolean; (merge: boolean): ThreeGlobe }}
      pointRadius={((d: any) => d.size) as unknown as { (): ObjAccessor<number>; (radiusAccessor: ObjAccessor<number>): ThreeGlobe }}
    />
  );
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, []);
  return null;
}

export function World(props: WorldProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight intensity={0.7} position={[10, 10, 5]} />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={0.5}
        autoRotate={true}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
