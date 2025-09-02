# 🎮 3D Effects Control Guide

Control the bouncing 3D elements, their opacity, animations, and more with these methods:

## 🚀 Quick Start Methods

### Method 1: Visual Control Panel
Open `3d-controls.html` in your browser for a visual interface with sliders and buttons to control everything in real-time.

### Method 2: Browser Console Commands
Open your portfolio website and use these commands in the browser console (F12):

## 🎾 Bouncing Controls

```javascript
// Control bounce height (0-2)
window.control3D.setBounceHeight(1.0);  // Higher = more bounce

// Control bounce speed (0.01-0.1)
window.control3D.setBounceSpeed(0.05);  // Higher = faster bounce

// Control rotation speed (0-0.05)
window.control3D.setRotationSpeed(0.02); // Higher = faster rotation
```

## 🎨 Visual Controls

```javascript
// Control opacity (0-1)
window.control3D.setElementOpacity(0.9);  // 0 = invisible, 1 = fully visible

// Control mouse influence (0-2)
window.control3D.setMouseInfluence(1.0);  // How much mouse affects elements

// Toggle wireframe mode
window.control3D.toggleWireframe();  // Switch between solid and wireframe

// Toggle scale pulse effect
window.control3D.toggleScalePulse();  // Add pulsing scale animation
```

## ⚡ Animation Controls

```javascript
// Pause all animations
window.control3D.pauseAnimations();

// Resume all animations
window.control3D.resumeAnimations();

// Show/Hide floating elements
window.control3D.toggleElements();

// Change element colors randomly
window.control3D.changeElementColors([0xff0000, 0x00ff00, 0x0000ff]);
```

## 🎯 Quick Presets

```javascript
// Apply predefined animation styles
window.control3D.presets.subtle();    // Calm and elegant
window.control3D.presets.normal();    // Default settings  
window.control3D.presets.energetic(); // High energy and dynamic
window.control3D.presets.minimal();   // Very subtle effects
```

## 🌈 Color Themes

```javascript
// Apply color themes
window.control3D.changeElementColors([
    0xff9a9e, 0xfecfef, 0xffeaa7, 0xfd79a8, 0xe17055  // Warm theme
]);

window.control3D.changeElementColors([
    0x667eea, 0x764ba2, 0x00c6ff, 0x0072ff, 0x74b9ff  // Cool theme
]);

window.control3D.changeElementColors([
    0xf093fb, 0xf5576c, 0x4facfe, 0x00f2fe, 0xff0080  // Neon theme
]);
```

## 📊 Configuration Object

Access the full configuration:

```javascript
// View current settings
console.log(window.control3D.config);

// The config structure:
{
    floatingElements: {
        bounceHeight: 0.5,     // How high they bounce (0-2)
        bounceSpeed: 0.02,     // How fast they bounce (0.01-0.1)
        rotationSpeed: 0.01,   // How fast they rotate (0-0.05)
        opacity: 0.7,          // Transparency (0-1)
        mouseInfluence: 0.5,   // Mouse interaction strength (0-2)
        wireframe: true,       // Show as wireframe or solid
        scalePulse: false      // Add pulsing scale effect
    }
}
```

## 🎭 Real-Time Examples

### Make elements very bouncy and energetic:
```javascript
window.control3D.setBounceHeight(1.5);
window.control3D.setBounceSpeed(0.06);
window.control3D.setRotationSpeed(0.03);
window.control3D.setElementOpacity(0.9);
```

### Make elements subtle and calm:
```javascript
window.control3D.setBounceHeight(0.2);
window.control3D.setBounceSpeed(0.015);
window.control3D.setRotationSpeed(0.005);
window.control3D.setElementOpacity(0.4);
```

### Hide elements completely:
```javascript
window.control3D.setElementOpacity(0);
// or
window.control3D.toggleElements();
```

### Make elements react strongly to mouse:
```javascript
window.control3D.setMouseInfluence(1.5);
```

## 🎪 Fun Experiments

```javascript
// Crazy bouncy mode
window.control3D.setBounceHeight(2.0);
window.control3D.setBounceSpeed(0.08);
window.control3D.toggleScalePulse();

// Ghost mode (barely visible)
window.control3D.setElementOpacity(0.1);
window.control3D.setBounceHeight(0.1);

// Hyperactive mode
window.control3D.presets.energetic();
window.control3D.setMouseInfluence(2.0);

// Freeze frame
window.control3D.pauseAnimations();
```

## 🛠️ Custom Configuration

Initialize with custom settings:

```javascript
// If you want to modify the defaults, edit the config in Advanced3DEffects.js
// Or pass custom config when creating the instance:

const customEffects = new Advanced3DEffects({
    floatingElements: {
        bounceHeight: 1.0,
        bounceSpeed: 0.03,
        opacity: 0.8,
        wireframe: false,
        scalePulse: true
    }
});
```

## 📱 Mobile Considerations

The effects automatically reduce complexity on mobile devices for better performance. You can control this with:

```javascript
// Force enable on mobile (not recommended)
window.control3D.config.performance.reduceOnMobile = false;
```

## 🔧 Troubleshooting

**Elements not responding?**
- Make sure Three.js is loaded: `typeof THREE !== 'undefined'`
- Check if controls exist: `typeof window.control3D !== 'undefined'`
- Open browser console to see any error messages

**Performance issues?**
```javascript
// Reduce particle count
window.control3D.config.particles.count = 50;

// Pause when not visible
window.control3D.config.performance.pauseWhenNotVisible = true;
```

---

## 🎨 Have Fun!

These 3D effects are designed to showcase your video editing and motion design skills. Experiment with different settings to find the perfect balance for your portfolio!
