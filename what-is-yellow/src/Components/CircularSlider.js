import React, { useRef, useState, useEffect } from 'react';
import InfoBox from './InfoBox';
import './CircularSlider.css';



const CircularSlider = ({ radius = 100, knobRadius = 10, knobs = 6, thickness = 10, strokeThickness = 3, size = 3, centerScale = 1, textValues = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"], minimumDistance = 10, onChange }) => {
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
  const clampBetween = (angle, min, max, minDist = minimumDistance) => {
    const clampAngle = (ang) => (ang % 360 + 360) % 360; // Ensure angles are between 0 and 359
    const minDistClamped = Math.min(minDist, 360); // Ensure minDist is within valid range
    const currentPos = clampAngle(angle);
    const lowerBound = clampAngle(min + minDistClamped); // Calculate the lower bound of the segment
    const upperBound = clampAngle(max - minDistClamped); // Calculate the upper bound of the segment
    //TODO edge case when theyre less than mindist away from 0 line
    var maxxedUp = false;
    if (lowerBound > upperBound) { // if ma is past 0 line
    maxxedUp = true; // set flag
    }
    const midPoint = (lowerBound + (maxxedUp ? upperBound + 360 : upperBound)) / 2; // Calculate the midpoint of the segment
    const flippedMidPoint = (midPoint + 180) % 360; // Calculate the opposite side of the midpoint

    const dist = (x, y) => (y - x + 360) % 360; // Calculate distance between two angles  <== makoto
  const betweenLowAndFMid = currentPos < lowerBound && currentPos > flippedMidPoint
  const betweenHighAndFMid = currentPos > upperBound && currentPos < flippedMidPoint

    if (midPoint > flippedMidPoint) { // 0 line is to the right
      if (betweenLowAndFMid) return lowerBound; //left of mid
      if (!maxxedUp && ((currentPos > upperBound && currentPos < 361) || (currentPos > -1 && currentPos < flippedMidPoint))) return upperBound; //right of mid, max isnt past 0 line, accounting for max -> 360 / 0 -> fmp
      if (maxxedUp && betweenHighAndFMid) return upperBound; //rightt of mid, max past 0 line
      return currentPos;
    } else if (midPoint < flippedMidPoint) { // 0 line is to the left
      if (betweenHighAndFMid) return upperBound; //right of mid
      if (!maxxedUp && ((currentPos < lowerBound && currentPos > -1) || (currentPos < 361 && currentPos > flippedMidPoint))) return lowerBound; //left of mid, min isnt past 0 line, accounting for min -> 360 / 0 -> fmp
      if (maxxedUp && betweenLowAndFMid) return lowerBound; //left of mid, max past 0 line
      return currentPos;
    }
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
  
  radius *= size;
  knobRadius *= size;
  thickness *= size;
  strokeThickness *= size;

  const [angles, setAngles] = useState(Array(knobs).fill(0));
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [lastSelectedColor, setLastSelectedColor] = useState(null);
  const [center, setCenter] = useState({ x: radius + knobRadius, y: radius + knobRadius });
  const [svgRect, setSvgRect] = useState(null);
  const svgRef = useRef(null);

  // State for managing the info box
  const [knobInfo, setKnobInfo] = useState(Array(knobs).fill(false));
  const [infoBoxContent, setInfoBoxContent] = useState("");
  const [infoBoxPosition, setInfoBoxPosition] = useState({ x: 0, y: 0 });

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

  // Event handler for clicking knobs
  // -> displays additional information about the color in a popup
  const handleKnobClick = (index) => (e) => {
    const color = hslToHex(angles[index], 100, 50);
    const knobPosition = knobPositions[index];

    if (knobInfo[index]) {
      setKnobInfo((prevInfo) => {
        const newInfo = [...prevInfo];
        newInfo[index] = false;
        setInfoBoxContent(`Info for knob ${index + 1}: ${color}`);
        setInfoBoxPosition({ x: knobPosition.x + 20, y: knobPosition.y });
        return newInfo;
      });
    } 
    else {
      setKnobInfo((prevInfo) => {
        const newInfo = [...prevInfo];
        newInfo[index] = true;
        setInfoBoxContent(`Info for knob ${index + 1}: ${color}`);
        setInfoBoxPosition({ x: knobPosition.x + 20, y: knobPosition.y });
        return newInfo;
      });
    }
  };

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
          const color = hslToHex(angle, 100, 50);
          setLastSelectedColor(color);
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

  const handleMouseLeave = (index) => () => {
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
        const color = hslToHex(newAngle, 100, 50);
        setLastSelectedColor(color);
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
    angle: clampAngle(angle)
  }));

  // Create the rainbow gradient with increased resolution
  const rainbowGradient = Array.from({ length: 720 }, (_, i) => {
    const color = `hsl(${Math.round(i / 2)}, 100%, 50%)`;
    const angle = i / 2;
    return (
      <line
        key={i}
        x1={center.x + (radius - thickness) * Math.cos(degToRad(angle))}
        y1={center.y + (radius - thickness) * Math.sin(degToRad(angle))}
        x2={center.x + (radius + thickness) * Math.cos(degToRad(angle))}
        y2={center.y + (radius + thickness) * Math.sin(degToRad(angle))}
        stroke={color}
        strokeWidth="5"
      />
    );
  });

  // Draw the center circle displaying the last selected color
  const colorDisplay = () => {
    const color = lastSelectedColor || '#000000';
    return (
      <circle cx={center.x} cy={center.y} r={knobRadius * 5 * centerScale} fill={color} />
    );
  };

  // Write text at the midpoint of each segment
  const textElements = knobPositions.map((pos, index) => {
    const nextIndex = (index + 1) % knobs;
    const nextPos = knobPositions[nextIndex];

    // special case for the last segment
    let temp = pos.angle;
    if (nextPos.angle < pos.angle) {
      temp = pos.angle - 360;
    }

    const avgHue = averageHue(temp, nextPos.angle);
    const color = `hsl(${avgHue}, 100%, 50%)`;
    const textAngle = averageHue(temp, nextPos.angle);
    const textPos = {
      x: center.x + (radius - knobRadius * 2) * Math.cos(degToRad(textAngle)),
      y: center.y + (radius - knobRadius * 2) * Math.sin(degToRad(textAngle))
    };

    return (
      <text
        key={index}
        x={textPos.x}
        y={textPos.y}
        fontSize={10 * size}
        fill={color}
        style={{ userSelect: 'none' }}
        textAnchor="middle"
      >
        {textValues[(index + 1) % knobs]}
      </text>
    );
  });

  // draw an arc connecting the two knobs
  const arc = (start, end) => {
    // inner arc
    const startAngle = degToRad(start);
    const endAngle = degToRad(end);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    const d = [
      'M',
      center.x + (radius - thickness) * Math.cos(startAngle),
      center.y + (radius - thickness) * Math.sin(startAngle),
      'A',
      radius - thickness,
      radius - thickness,
      0,
      largeArcFlag,
      1,
      center.x + (radius - thickness) * Math.cos(endAngle),
      center.y + (radius - thickness) * Math.sin(endAngle)
    ].join(' ');

    // outer arc
    const startAngleOuter = degToRad(start);
    const endAngleOuter = degToRad(end);
    const largeArcFlagOuter = end - start <= 180 ? '0' : '1';
    const dOuter = [
      'M',
      center.x + (radius + thickness) * Math.cos(startAngleOuter),
      center.y + (radius + thickness) * Math.sin(startAngleOuter),
      'A',
      radius + thickness,
      radius + thickness,
      0,
      largeArcFlagOuter,
      1,
      center.x + (radius + thickness) * Math.cos(endAngleOuter),
      center.y + (radius + thickness) * Math.sin(endAngleOuter)
    ].join(' ');

    return (
      <g key={start}>
        <path d={d} fill="none" stroke="black" strokeWidth={strokeThickness} />
        <path d={dOuter} fill="none" stroke="black" strokeWidth={strokeThickness} />
      </g>
    )
  };

  // Draw the arcs connecting the knobs
  const arcElements = knobPositions.map((pos, index) => {
    const nextIndex = (index + 1) % knobs;
    const nextPos = knobPositions[nextIndex];
    return arc(pos.angle, nextPos.angle);
  });

  // Draw the knobs and hex values
  const knobElements = knobPositions.map((pos, index) => {
    const color = hslToHex(pos.angle, 100, 50);

    return (
      <g key={index}>
        <text
          x={center.x + (radius - thickness * 2) * Math.cos(degToRad(pos.angle))}
          y={center.y + (radius - thickness * 2) * Math.sin(degToRad(pos.angle))}
          fontSize={10 * size}
          fill="black"
          style={{ userSelect: 'none' }}
          textAnchor="middle"
        >
          {color}
        </text>
        <text
          x={center.x + (radius + thickness * 2) * Math.cos(degToRad(pos.angle))}
          y={center.y + (radius + thickness * 2) * Math.sin(degToRad(pos.angle))}
          fontSize={10 * size}
          fill="black"
          style={{ userSelect: 'none' }}
          textAnchor="middle"
        >
          {Math.round(pos.angle)}
        </text>

        <line
          x1={center.x + (radius - thickness) * Math.cos(degToRad(pos.angle))}
          y1={center.y + (radius - thickness) * Math.sin(degToRad(pos.angle))}
          x2={center.x + (radius + thickness) * Math.cos(degToRad(pos.angle))}
          y2={center.y + (radius + thickness) * Math.sin(degToRad(pos.angle))}
          stroke="black"
          strokeWidth={strokeThickness}
          onMouseDown={handleMouseDown(index)}
          onMouseEnter={handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave(index)}
          onDoubleClick={handleKnobClick(index)}
        />

        <circle
          cx={center.x + (radius - thickness) * Math.cos(degToRad(pos.angle))}
          cy={center.y + (radius - thickness) * Math.sin(degToRad(pos.angle))}
          r={strokeThickness}
          fill="black"
          strokeWidth={strokeThickness}
          onMouseDown={handleMouseDown(index)}
          onMouseEnter={handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave(index)}
        />

        <circle
          id={"outerCircle" + index}
          cx={center.x + (radius + thickness) * Math.cos(degToRad(pos.angle))}
          cy={center.y + (radius + thickness) * Math.sin(degToRad(pos.angle))}
          r={strokeThickness}
          fill="black"
          strokeWidth={strokeThickness}
          onMouseDown={handleMouseDown(index)}
          onMouseEnter={handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave(index)}
        />
      </g>
    );
  });

  return (
    <div className='CircularSlider'>
      <svg ref={svgRef} width={2 * (radius + knobRadius * 2) * 1.25} height={2 * (radius + knobRadius * 2) * 1.25}>
        {rainbowGradient}
        {colorDisplay()}
        {textElements}
        {arcElements}
        {knobElements}
      </svg>
      {knobInfo.some((info) => info) && (
        <InfoBox content={infoBoxContent} position={infoBoxPosition} />
      )}
    </div>
  );
};

export default CircularSlider;
