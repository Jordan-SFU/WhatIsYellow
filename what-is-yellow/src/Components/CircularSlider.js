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
            onChange(index, angle);
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
          stroke="black"
          strokeWidth="2"
        />
        <path
          d={`M ${center.x + (radius + knobRadius) * Math.cos(degToRad(pos.angle))}
              ${center.y + (radius + knobRadius) * Math.sin(degToRad(pos.angle))}
              A ${radius + knobRadius} ${radius + knobRadius} 0 ${Math.abs(nextPos.angle - pos.angle) > 180 ? 1 : 0} 1
              ${center.x + (radius + knobRadius) * Math.cos(degToRad(nextPos.angle))}
              ${center.y + (radius + knobRadius) * Math.sin(degToRad(nextPos.angle))}`}
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
      </g>
    );
  });

  // Display hue values of the segment endpoints
  const hueText = knobPositions.map((pos, index) => {
    const nextIndex = (index + 1) % knobs;
    let nextPos = knobPositions[nextIndex];

    let startAngle = clampAngle(pos.angle);
    let endAngle = clampAngle(nextPos.angle);
    if (endAngle < startAngle) {
      endAngle += 360;
    }

    const midAngle = (startAngle + endAngle) / 2;
    const midX = center.x + radius * 1.25 * Math.cos(degToRad(midAngle));
    const midY = center.y + radius * 1.25 * Math.sin(degToRad(midAngle));
    const hueStart = Math.round(startAngle);
    const hueEnd = Math.round(endAngle % 360);

    return (
      <text
        key={index}
        x={midX}
        y={midY}
        fill="black"
        fontSize="12"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {`(${hueStart}°, ${hueEnd}°)`}
      </text>
    );
  });

  // Function to get the color at a specific angle
  const getColorAtAngle = (angle) => {
    const hue = Math.round(clampAngle(angle));
    return `hsl(${hue}, 100%, 50%)`;
  };

  // Function to handle display of hue and hex code
  const renderHueInfo = (index) => {
    const angle = angles[index];
    const hue = Math.round(angle);
    const color = getColorAtAngle(angle);
    const hex = hslToHex(hue, 100, 50);

    const posX = center.x + (radius + knobRadius * 2.5) * Math.cos(degToRad(angle));
    const posY = center.y + (radius + knobRadius * 2.5) * Math.sin(degToRad(angle));

    return (
      <g key={`info-${index}`}>
        <rect
          x={posX - 40}
          y={posY - 30}
          width={80}
          height={40}
          fill="white"
          stroke="black"
        />
        <text x={posX} y={posY - 15} fill="black" fontSize="12" textAnchor="middle">{`Hue: ${hue}°`}</text>
        <text x={posX} y={posY} fill="black" fontSize="12" textAnchor="middle">{`Hex: ${hex}`}</text>
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      width={center.x * 2 + 100}
      height={center.y * 2 + 100}
      style={{ userSelect: 'none', touchAction: 'none' }}
    >
      <g transform={`translate(${50}, ${50})`}>
        {rainbowGradient}
        {outlines}
        {hueText}
        {knobPositions.map((pos, index) => (
          <g key={index}>
            <path
              d={`
                M ${pos.x} ${pos.y}
                L ${center.x + (radius + knobRadius * 2) * Math.cos(degToRad(pos.angle + 5))}
                  ${center.y + (radius + knobRadius * 2) * Math.sin(degToRad(pos.angle + 5))}
                A ${knobRadius} ${knobRadius} 0 0 1
                  ${center.x + (radius + knobRadius * 2) * Math.cos(degToRad(pos.angle - 5))}
                  ${center.y + (radius + knobRadius * 2) * Math.sin(degToRad(pos.angle - 5))}
                Z
              `}
              fill={getColorAtAngle(pos.angle)}
              stroke="black"
              strokeWidth={2}
              onMouseDown={handleMouseDown(index)}
            />
            <circle
              cx={center.x + (radius + knobRadius * 2.5) * Math.cos(degToRad(pos.angle))}
              cy={center.y + (radius + knobRadius * 2.5) * Math.sin(degToRad(pos.angle))}
              r={knobRadius / 2}
              fill={getColorAtAngle(pos.angle)}
              stroke="black"
              strokeWidth={2}
              onMouseDown={handleMouseDown(index)}
            />
            {activeIndex === index && renderHueInfo(index)}
          </g>
        ))}
      </g>
    </svg>
  );
};

export default CircularSlider;
