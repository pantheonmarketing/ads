'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlignLeft, AlignCenter, AlignRight, Wand2 } from 'lucide-react'
import { fonts } from '../fonts'

interface GeneratedAd {
  topText: string;
  bottomText: string;
  topFont: string;
  bottomFont: string;
  topFontSize: number;
  bottomFontSize: number;
  topTextColor: string;
  bottomTextColor: string;
  topTextCase: string;
  bottomTextCase: string;
  topTextAlignment: string;
  bottomTextAlignment: string;
  topTextOutline: boolean;
  bottomTextOutline: boolean;
  topAutoBreak: boolean;
  bottomAutoBreak: boolean;
  imageSize: number;
  imagePositionX: number;
  imagePositionY: number;
  backgroundOverlay: number;
  exportSize: { width: number; height: number };
}

interface AdEditorComponentProps {
  generatedAd: GeneratedAd;
  onUpdate: (ad: GeneratedAd) => void;
  onSave: (ad: GeneratedAd) => void;
  onCancel: () => void;
}

export function AdEditorComponent({ generatedAd, onUpdate, onSave, onCancel }: AdEditorComponentProps) {
  console.log('AdEditorComponent rendered with props:', { generatedAd, onUpdate, onSave, onCancel });

  const [editedAd, setEditedAd] = useState<GeneratedAd>(generatedAd)
  const [matchTexts, setMatchTexts] = useState(false)

  useEffect(() => {
    console.log('editedAd updated:', editedAd);
    onUpdate(editedAd)
  }, [editedAd, onUpdate])

  const handleChange = (field: keyof GeneratedAd, value: GeneratedAd[keyof GeneratedAd], position: 'top' | 'bottom' | null = null) => {
    console.log('handleChange called:', { field, value, position });
    setEditedAd(prev => {
      const newState = { ...prev }
      if (position) {
        const key = `${position}${field}` as keyof GeneratedAd
        newState[key] = value as GeneratedAd[typeof key]
        if (matchTexts && (position === 'top' || position === 'bottom')) {
          const otherPosition = position === 'top' ? 'bottom' : 'top'
          const otherKey = `${otherPosition}${field}` as keyof GeneratedAd
          newState[otherKey] = value as GeneratedAd[typeof otherKey]
        }
      } else {
        newState[field] = value as GeneratedAd[typeof field]
      }
      return newState
    })
    onUpdate(editedAd)
  }

  const handleMatchTextsChange = (checked: boolean) => {
    console.log('handleMatchTextsChange called:', checked);
    setMatchTexts(checked)
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
      }))
    }
  }

  const applyAIDesign = () => {
    console.log('Applying AI Design');
    const updatedAd = { ...editedAd };
    const canvasWidth = updatedAd.exportSize.width;
    const canvasHeight = updatedAd.exportSize.height;

    // Apply AI design logic here
    updatedAd.topFont = 'Impact';
    updatedAd.bottomFont = 'Impact';
    updatedAd.topFontSize = Math.min(canvasWidth * 0.08, 80);
    updatedAd.bottomFontSize = Math.min(canvasWidth * 0.08, 80);
    updatedAd.topTextColor = '#8B0000'; // Dark red
    updatedAd.bottomTextColor = '#00008B'; // Dark blue
    updatedAd.topTextCase = 'uppercase';
    updatedAd.bottomTextCase = 'uppercase';
    updatedAd.topTextAlignment = 'center';
    updatedAd.bottomTextAlignment = 'center';
    updatedAd.topTextOutline = false;
    updatedAd.bottomTextOutline = false;
    updatedAd.topAutoBreak = true;
    updatedAd.bottomAutoBreak = true;
    updatedAd.imageSize = 80;
    updatedAd.imagePositionX = 50;
    updatedAd.imagePositionY = 50;
    updatedAd.backgroundOverlay = 20;

    setEditedAd(updatedAd);
    onUpdate(updatedAd);
  }

  const TextEditor = ({ position }: { position: 'top' | 'bottom' }) => (
    <div className="space-y-4">
      <Input
        value={editedAd[`${position}Text`]}
        onChange={(e) => handleChange('Text' as keyof GeneratedAd, e.target.value, position)}
        placeholder={`${position.charAt(0).toUpperCase() + position.slice(1)} Text`}
      />
      <Select
        value={editedAd[`${position}Font`]}
        onValueChange={(value) => handleChange('Font' as keyof GeneratedAd, value, position)}
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
        value={editedAd[`${position}TextColor`]}
        onChange={(e) => handleChange('TextColor' as keyof GeneratedAd, e.target.value, position)}
      />
      <Slider
        value={[editedAd[`${position}FontSize`]]}
        onValueChange={(value) => handleChange('FontSize' as keyof GeneratedAd, value[0], position)}
        min={10}
        max={100}
      />
      <Slider
        value={[editedAd[`${position}Padding`] ?? 10]}
        onValueChange={(value) => handleChange(`${position}Padding` as keyof GeneratedAd, value[0])}
        min={0}
        max={100}
      />
      <Select
        value={editedAd[`${position}TextCase`]}
        onValueChange={(value) => handleChange('TextCase' as keyof GeneratedAd, value, position)}
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
          onClick={() => handleChange('TextAlignment' as keyof GeneratedAd, 'left', position)}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={editedAd[`${position}TextAlignment`] === 'center' ? 'default' : 'outline'}
          onClick={() => handleChange('TextAlignment' as keyof GeneratedAd, 'center', position)}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={editedAd[`${position}TextAlignment`] === 'right' ? 'default' : 'outline'}
          onClick={() => handleChange('TextAlignment' as keyof GeneratedAd, 'right', position)}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${position}TextOutline`}
          checked={editedAd[`${position}TextOutline`]}
          onCheckedChange={(checked) => handleChange('TextOutline' as keyof GeneratedAd, checked as boolean, position)}
        />
        <Label htmlFor={`${position}TextOutline`}>Text Outline</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id={`${position}AutoBreak`}
          checked={editedAd[`${position}AutoBreak`]}
          onCheckedChange={(checked) => handleChange('AutoBreak' as keyof GeneratedAd, checked, position)}
        />
        <Label htmlFor={`${position}AutoBreak`}>Auto Line Break</Label>
      </div>
    </div>
  )

  const ImageControls = () => (
    <div className="space-y-4">
      <div>
        <Label>Image Size</Label>
        <Slider
          value={[editedAd.imageSize]}
          onValueChange={(value) => handleChange('imageSize', value[0])}
          min={50}
          max={150}
          step={1}
        />
        <span>{editedAd.imageSize}%</span>
      </div>
      <div>
        <Label>Image Position X</Label>
        <Slider
          value={[editedAd.imagePositionX]}
          onValueChange={(value) => handleChange('imagePositionX', value[0])}
          min={0}
          max={100}
          step={1}
        />
        <span>{editedAd.imagePositionX}%</span>
      </div>
      <div>
        <Label>Image Position Y</Label>
        <Slider
          value={[editedAd.imagePositionY]}
          onValueChange={(value) => handleChange('imagePositionY', value[0])}
          min={0}
          max={100}
          step={1}
        />
        <span>{editedAd.imagePositionY}%</span>
      </div>
      <div>
        <Label>Background Overlay</Label>
        <Slider
          value={[editedAd.backgroundOverlay]}
          onValueChange={(value) => handleChange('backgroundOverlay', value[0])}
          min={0}
          max={100}
          step={1}
        />
        <span>{editedAd.backgroundOverlay}%</span>
      </div>
      <div>
        <Label>Export Size</Label>
        <Select
          value={JSON.stringify(editedAd.exportSize)}
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
  )

  console.log('Rendering AdEditorComponent');

  return (
    <div className="space-y-4">
      <Button 
        onClick={applyAIDesign} 
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-200 ease-in-out hover:scale-105"
      >
        <Wand2 className="mr-2 h-5 w-5" /> AI Magic Design
      </Button>
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
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(editedAd)}>Save</Button>
      </div>
    </div>
  )
}