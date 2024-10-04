import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { AlignLeft, AlignCenter, AlignRight, Download, Save, RotateCcw } from 'lucide-react';
import { fonts } from '../fonts';

export function AdEditorComponent({ generatedAd, onUpdate, onSave, onCancel }) {
  const [editedAd, setEditedAd] = useState(generatedAd);
  const [matchTexts, setMatchTexts] = useState(false);

  useEffect(() => {
    onUpdate(editedAd);
  }, [editedAd, onUpdate]);

  const handleChange = (field, value, position = null) => {
    setEditedAd(prev => {
      const newState = { ...prev };
      if (position) {
        newState[`${position}${field}`] = value;
        if (matchTexts && (position === 'top' || position === 'bottom')) {
          const otherPosition = position === 'top' ? 'bottom' : 'top';
          newState[`${otherPosition}${field}`] = value;
        }
      } else {
        newState[field] = value;
      }
      return newState;
    });
  };

  const handleMatchTextsChange = (checked) => {
    setMatchTexts(checked);
    if (checked) {
      setEditedAd(prev => ({
        ...prev,
        bottomFont: prev.topFont,
        bottomFontSize: prev.topFontSize,
        bottomTextColor: prev.topTextColor,
        bottomTextCase: prev.topTextCase,
        bottomTextAlignment: prev.topTextAlignment,
        bottomTextOutline: prev.topTextOutline,
        bottomAutoBreak: prev.topAutoBreak,
      }));
    }
  };

  const TextEditor = ({ position }) => (
    <div className="space-y-4">
      <Input
        value={editedAd[`${position}Text`] || ''}
        onChange={(e) => handleChange('Text', e.target.value, position)}
        placeholder={`${position.charAt(0).toUpperCase() + position.slice(1)} Text`}
      />
      <Select
        value={editedAd[`${position}Font`] || 'Arial'}
        onValueChange={(value) => handleChange('Font', value, position)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(fonts).map((font) => (
            <SelectItem key={font} value={font}>{font}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="color"
        value={editedAd[`${position}TextColor`] || '#000000'}
        onChange={(e) => handleChange('TextColor', e.target.value, position)}
      />
      <Slider
        value={[editedAd[`${position}FontSize`] || 40]}
        onValueChange={(value) => handleChange('FontSize', value[0], position)}
        min={10}
        max={100}
      />
      <Slider
        value={[editedAd[`${position}Padding`] || 10]}
        onValueChange={(value) => handleChange('Padding', value[0], position)}
        min={0}
        max={100}
      />
      <Select
        value={editedAd[`${position}TextCase`] || 'normal'}
        onValueChange={(value) => handleChange('TextCase', value, position)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select text case" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="uppercase">Uppercase</SelectItem>
          <SelectItem value="lowercase">Lowercase</SelectItem>
          <SelectItem value="capitalize">Capitalize</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex space-x-2">
        <Button
          variant={editedAd[`${position}TextAlignment`] === 'left' ? 'default' : 'outline'}
          onClick={() => handleChange('TextAlignment', 'left', position)}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={editedAd[`${position}TextAlignment`] === 'center' ? 'default' : 'outline'}
          onClick={() => handleChange('TextAlignment', 'center', position)}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={editedAd[`${position}TextAlignment`] === 'right' ? 'default' : 'outline'}
          onClick={() => handleChange('TextAlignment', 'right', position)}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${position}TextOutline`}
          checked={editedAd[`${position}TextOutline`] || false}
          onCheckedChange={(checked) => handleChange('TextOutline', checked, position)}
        />
        <Label htmlFor={`${position}TextOutline`}>Text Outline</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id={`${position}AutoBreak`}
          checked={editedAd[`${position}AutoBreak`] || false}
          onCheckedChange={(checked) => handleChange('AutoBreak', checked, position)}
        />
        <Label htmlFor={`${position}AutoBreak`}>Auto Line Break</Label>
      </div>
    </div>
  );

  const ImageControls = () => (
    <div className="space-y-4">
      <div>
        <Label>Image Size</Label>
        <Slider
          value={[editedAd.imageSize || 100]}
          onValueChange={(value) => handleChange('imageSize', value[0])}
          min={50}
          max={150}
        />
      </div>
      <div>
        <Label>Image Position X</Label>
        <Slider
          value={[editedAd.imagePositionX || 50]}
          onValueChange={(value) => handleChange('imagePositionX', value[0])}
          min={0}
          max={100}
        />
      </div>
      <div>
        <Label>Image Position Y</Label>
        <Slider
          value={[editedAd.imagePositionY || 50]}
          onValueChange={(value) => handleChange('imagePositionY', value[0])}
          min={0}
          max={100}
        />
      </div>
      <div>
        <Label>Background Overlay</Label>
        <Slider
          value={[editedAd.backgroundOverlay || 0]}
          onValueChange={(value) => handleChange('backgroundOverlay', value[0])}
          min={0}
          max={100}
        />
      </div>
      <div>
        <Label>Export Size</Label>
        <Select
          value={JSON.stringify(editedAd.exportSize || { width: 1080, height: 1080 })}
          onValueChange={(value) => handleChange('exportSize', JSON.parse(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select export size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={JSON.stringify({ width: 1080, height: 1080 })}>Square (1080x1080)</SelectItem>
            <SelectItem value={JSON.stringify({ width: 1200, height: 628 })}>Landscape (1200x628)</SelectItem>
            <SelectItem value={JSON.stringify({ width: 1080, height: 1350 })}>Portrait (1080x1350)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="matchTexts"
          checked={matchTexts}
          onCheckedChange={handleMatchTextsChange}
        />
        <Label htmlFor="matchTexts">Match Top & Bottom Text</Label>
      </div>
      <Tabs defaultValue="top">
        <TabsList>
          <TabsTrigger value="top">Top Text</TabsTrigger>
          <TabsTrigger value="bottom">Bottom Text</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>
        <TabsContent value="top">
          <TextEditor position="top" />
        </TabsContent>
        <TabsContent value="bottom">
          <TextEditor position="bottom" />
        </TabsContent>
        <TabsContent value="image">
          <ImageControls />
        </TabsContent>
      </Tabs>
      <div className="flex space-x-2">
        <Button onClick={() => onSave(editedAd)}>
          <Save className="mr-2 h-4 w-4" /> Save Style
        </Button>
        <Button variant="outline" onClick={() => setEditedAd(generatedAd)}>
          <RotateCcw className="mr-2 h-4 w-4" /> Load Default
        </Button>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(editedAd)}>Save</Button>
      </div>
    </div>
  );
}