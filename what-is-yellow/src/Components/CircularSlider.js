import React, { useRef, useState, useEffect } from 'react';

// Utility function to convert degrees to radians
const degToRad = (deg) => (deg * Math.PI) / 180;

// Utility function to convert radians to degrees
const radToDeg = (rad) => (rad * 180) / Math.PI;

// Calculate the angle from the center of the circle to the mouse pointer
const getAngle = (cx, cy, x, y) => {
  const dx = x - cx;
  const dy = y - cy;
  const angle = radToDeg(Math.atan2(dy, dx));
  return angle >= 0 ? angle : angle + 360;
};

// Clamp an angle to be within 0-360 degrees
const clampAngle = (angle) => (angle + 360) % 360;

// Function to clamp an angle between two other angles with a minimum distance constraint
const clampBetween = (angle, min, max, minDist = 10) => {
  const clampAngle = (ang) => (ang % 360 + 360) % 360; // Ensure angles are between 0 and 359
  const a = clampAngle(angle);
  const mi = clampAngle(min);
  const ma = clampAngle(max);
  const dist = (x, y) => (y - x + 360) % 360; // Calculate distance between two angles

  const minDistClamped = Math.min(minDist, 360); // Ensure minDist is within valid range

  if (mi <= ma) {
    if (a < mi + minDistClamped) return mi + minDistClamped;
    if (a > ma - minDistClamped) return ma - minDistClamped;
  } else {
    if (a > ma && a < mi + minDistClamped) return mi + minDistClamped;
    if (a > ma - minDistClamped && a < mi) return ma - minDistClamped;
    if (a < mi && a > ma) return a - mi < ma - a ? mi + minDistClamped : ma - minDistClamped;
  }
  return a;
};

// Calculate the average hue of a segment
const averageHue = (start, end) => {
  const diff = end - start;
  const hue = start + diff / 2;
  return hue % 360;
};

// Utility function to convert HSL to Hex
const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return `#${f(0).toString(16).padStart(2, '0')}${f(8).toString(16).padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}`;
};

const CircularSlider = ({ radius = 100, knobRadius = 10, knobs = 6, onChange }) => {
  const [angles, setAngles] = useState(Array(knobs).fill(0));
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [center, setCenter] = useState({ x: radius + knobRadius, y: radius + knobRadius });
  const [svgRect, setSvgRect] = useState(null);
  const svgRef = useRef(null);

  // Calculate the angles for each knob based on even spacing
  useEffect(() => {
    const angleStep = 360 / knobs;
    setAngles((prevAngles) =>
      prevAngles.map((_, index) => angleStep * index)
    );
  }, [knobs]);

  // Update the center and bounding rect when the size or padding changes
  useEffect(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setSvgRect(rect);
      setCenter({ x: rect.width / 2, y: rect.height / 2 });
    }
  }, [radius, knobRadius]);

  // Event handlers for dragging knobs
  const handleMouseDown = (index) => (e) => {
    e.stopPropagation();
    setActiveIndex(index);
    const onMouseMove = (moveEvent) => {
      if (svgRect) {
        const x = moveEvent.clientX - svgRect.left - center.x;
        const y = moveEvent.clientY - svgRect.top - center.y;
        let angle = clampAngle(getAngle(0, 0, x, y));
        if (knobs > 1) {
          const prevIndex = (index - 1 + knobs) % knobs;
          const nextIndex = (index + 1) % knobs;
          angle = clampBetween(angle, angles[prevIndex], angles[nextIndex]);
        }
        setAngles((prevAngles) => {
          const newAngles = [...prevAngles];
          newAngles[index] = angle;
          if (onChange) {
            // round to nearest integer
            onChange(index, Math.round(angle));
          }
          return newAngles;
        });
      }
    };

    const onMouseUp = () => {
      setActiveIndex(null);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Event handlers for hovering knobs
  const handleMouseEnter = (index) => () => {
    if (hoveredIndex === null) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Event handler for the scroll wheel
  const handleWheel = (e) => {
    if (hoveredIndex !== null) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      setAngles((prevAngles) => {
        const newAngles = [...prevAngles];
        let newAngle = clampAngle(newAngles[hoveredIndex] + delta);
        if (knobs > 1) {
          const prevIndex = (hoveredIndex - 1 + knobs) % knobs;
          const nextIndex = (hoveredIndex + 1) % knobs;
          newAngle = clampBetween(newAngle, angles[prevIndex], angles[nextIndex]);
        }
        newAngles[hoveredIndex] = newAngle;
        if (onChange) {
          onChange(hoveredIndex, Math.round(newAngle));
        }
        return newAngles;
      });
    }
  };

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.addEventListener('wheel', handleWheel);
      return () => {
        svgRef.current.removeEventListener('wheel', handleWheel);
      };
    }
  }, [hoveredIndex]);

  // Calculate the knob positions based on the angles
  const knobPositions = angles.map((angle) => ({
    x: center.x + (radius + knobRadius * 1.5) * Math.cos(degToRad(angle)),
    y: center.y + (radius + knobRadius * 1.5) * Math.sin(degToRad(angle)),
    angle: angle
  }));

  // Create the rainbow gradient with increased resolution
  const rainbowGradient = Array.from({ length: 720 }, (_, i) => {
    const color = `hsl(${i / 2}, 100%, 50%)`;
    const angle = i / 2;
    return (
      <line
        key={i}
        x1={center.x + (radius - knobRadius) * Math.cos(degToRad(angle))}
        y1={center.y + (radius - knobRadius) * Math.sin(degToRad(angle))}
        x2={center.x + (radius + knobRadius) * Math.cos(degToRad(angle))}
        y2={center.y + (radius + knobRadius) * Math.sin(degToRad(angle))}
        stroke={color}
        strokeWidth={knobRadius * 2}
      />
    );
  });

  // Draw the outlines of each segment
  const outlines = knobPositions.map((pos, index) => {
    const nextIndex = (index + 1) % knobs;
    const nextPos = knobPositions[nextIndex];

    if (nextPos.angle < pos.angle) {
      pos.angle = pos.angle - 360;
    }

    const avgHue = averageHue(pos.angle, nextPos.angle);
    const color = `hsl(${avgHue}, 100%, 50%)`;
    return (
      <g key={index}>
        <path
          d={`M ${center.x + (radius - knobRadius) * Math.cos(degToRad(pos.angle))}
              ${center.y + (radius - knobRadius) * Math.sin(degToRad(pos.angle))}
              A ${radius - knobRadius} ${radius - knobRadius} 0 ${Math.abs(nextPos.angle - pos.angle) > 180 ? 1 : 0} 1
              ${center.x + (radius - knobRadius) * Math.cos(degToRad(nextPos.angle))}
              ${center.y + (radius - knobRadius) * Math.sin(degToRad(nextPos.angle))}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <path
          d={`M ${center.x + (radius + knobRadius) * Math.cos(degToRad(pos.angle))}
              ${center.y + (radius + knobRadius) * Math.sin(degToRad(pos.angle))}
              A ${radius + knobRadius} ${radius + knobRadius} 0 ${Math.abs(nextPos.angle - pos.angle) > 180 ? 1 : 0} 1
              ${center.x + (radius + knobRadius) * Math.cos(degToRad(nextPos.angle))}
              ${center.y + (radius + knobRadius) * Math.sin(degToRad(nextPos.angle))}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </g>
    );
  });

  // Draw the knobs and hex values
  const knobElements = knobPositions.map((pos, index) => {
    const color = hslToHex(pos.angle, 100, 50);

    const trianglePoints = `${center.x + 100 * Math.cos(degToRad(pos.angle))},${center.y + 100 * Math.sin(degToRad(pos.angle))} ${center.x + 110 * Math.cos(degToRad(pos.angle + 2))},${center.y + 110 * Math.sin(degToRad(pos.angle + 2))} ${center.x + 110 * Math.cos(degToRad(pos.angle - 2))},${center.y + 110 * Math.sin(degToRad(pos.angle - 2))}`;
    return (
      <g key={index}>
        <text
          x={pos.x + 20 * Math.cos(degToRad(pos.angle))}
          y={pos.y + 20 * Math.sin(degToRad(pos.angle))}
          fontSize="10"
          fill="black"
          style={{ userSelect: 'none' }}
          textAnchor="middle"
        >
          {color}
        </text>

        <circle
          cx={pos.x}
          cy={pos.y}
          r={knobRadius}
          fill="black"
          stroke={activeIndex === index || hoveredIndex === index ? 'black' : 'none'}
          strokeWidth={2}
          onMouseDown={handleMouseDown(index)}
          onMouseEnter={handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />

        <polygon
          points={trianglePoints}
          fill="black"
          stroke={activeIndex === index || hoveredIndex === index ? 'black' : 'none'}
          strokeWidth={2}
          onMouseDown={handleMouseDown(index)}
          onMouseEnter={handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      </g>
    );
  });

  return (
    <svg ref={svgRef} width={2 * (radius + knobRadius * 2) * 1.25} height={2 * (radius + knobRadius * 2) * 1.25}>
      {rainbowGradient}
      {outlines}
      {knobElements}
    </svg>
  );
};

export default CircularSlider;
