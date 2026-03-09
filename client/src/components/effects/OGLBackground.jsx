import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';

const vertexShader = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragmentShader = `
  precision highp float;
  
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Create flowing noise
    float noise1 = snoise(uv * 2.0 + uTime * 0.1);
    float noise2 = snoise(uv * 3.0 - uTime * 0.15);
    float noise3 = snoise(uv * 1.5 + uTime * 0.08);
    
    // Combine noises for organic movement
    float combinedNoise = (noise1 + noise2 * 0.5 + noise3 * 0.25) / 1.75;
    
    // Create gradient positions
    float gradient1 = smoothstep(0.0, 1.0, uv.y + combinedNoise * 0.3);
    float gradient2 = smoothstep(0.0, 1.0, uv.x + combinedNoise * 0.2);
    
    // Mix colors with gradients
    vec3 color = mix(uColor1, uColor2, gradient1);
    color = mix(color, uColor3, gradient2 * 0.5);
    
    // Add subtle noise texture
    color += combinedNoise * 0.03;
    
    // Vignette effect
    vec2 vignetteUv = uv * (1.0 - uv);
    float vignette = vignetteUv.x * vignetteUv.y * 15.0;
    vignette = pow(vignette, 0.25);
    
    gl_FragColor = vec4(color * vignette, 1.0);
  }
`;

const OGLBackground = ({ className = '' }) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize renderer
    const renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    rendererRef.current = renderer;

    const gl = renderer.gl;
    gl.clearColor(0.012, 0.012, 0.012, 1);

    // Handle resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (programRef.current) {
        programRef.current.uniforms.uResolution.value = [
          window.innerWidth,
          window.innerHeight,
        ];
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Create geometry (fullscreen triangle)
    const geometry = new Triangle(gl);

    // Create program
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new Color('#030303') }, // Dark base
        uColor2: { value: new Color('#0a0f1e') }, // Navy
        uColor3: { value: new Color('#1a1a0a') }, // Dark yellow tint
        uResolution: { value: [window.innerWidth, window.innerHeight] },
      },
    });
    programRef.current = program;

    // Create mesh
    const mesh = new Mesh(gl, { geometry, program });

    // Animation loop
    const animate = (time) => {
      program.uniforms.uTime.value = time * 0.001;
      renderer.render({ scene: mesh });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full -z-10 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default OGLBackground;
