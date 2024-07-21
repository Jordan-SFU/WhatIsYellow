import './InfoBox.css';

const InfoBox = ({ content, position }) => (
    // add blur and half opacity to the background
    <div className={`info-box ${content ? 'show' : ''}`} style={{ top: position.y, left: position.x}}>
      {content}
    </div>
  );

export default InfoBox;