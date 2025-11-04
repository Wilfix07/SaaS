import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CompleteFormData } from './form-schema';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export function exportToPDF(formData: CompleteFormData, prompt: string) {
  const doc = new jsPDF();
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Specification', 105, yPosition, { align: 'center' });
  yPosition += 15;

  // Project Name
  doc.setFontSize(16);
  doc.text(formData.brandIdentity.projectName, 105, yPosition, { align: 'center' });
  yPosition += 10;

  // Brand Identity Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Brand Identity', 20, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  if (formData.brandIdentity.slogan) {
    doc.text(`Slogan: ${formData.brandIdentity.slogan}`, 20, yPosition);
    yPosition += 6;
  }

  doc.text('Mission:', 20, yPosition);
  yPosition += 5;
  const missionLines = doc.splitTextToSize(formData.brandIdentity.mission, 170);
  doc.text(missionLines, 20, yPosition);
  yPosition += missionLines.length * 5 + 5;

  doc.text('Objectives:', 20, yPosition);
  yPosition += 5;
  const objectivesLines = doc.splitTextToSize(formData.brandIdentity.objectives, 170);
  doc.text(objectivesLines, 20, yPosition);
  yPosition += objectivesLines.length * 5 + 10;

  // Check if new page needed
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Color Palette Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Color Palette', 20, yPosition);
  yPosition += 10;

  const colorData = [
    ['Primary Color', formData.colorPalette.primaryColor],
    ['Secondary Color', formData.colorPalette.secondaryColor],
    ['Background Color', formData.colorPalette.backgroundColor],
    ['Text Color', formData.colorPalette.textColor],
    ['Banner Color', formData.colorPalette.bannerColor],
    ['Footer Color', formData.colorPalette.footerColor],
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Color Type', 'Hex Value']],
    body: colorData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20 },
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Check if new page needed
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Design Structure Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Design Structure', 20, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project Type: ${formData.designStructure.projectType}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Visual Style: ${formData.designStructure.visualStyle}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Layout: ${formData.designStructure.preferredLayout}`, 20, yPosition);
  yPosition += 6;
  
  if (formData.designStructure.fontTypography) {
    doc.text(`Typography: ${formData.designStructure.fontTypography}`, 20, yPosition);
    yPosition += 6;
  }

  doc.text(`Sections: ${formData.designStructure.sectionsToInclude.join(', ')}`, 20, yPosition);
  yPosition += 10;

  // Check if new page needed
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Technology Stack Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Technology Stack', 20, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Technologies: ${formData.technology.preferredTechnology.join(', ')}`, 20, yPosition);
  yPosition += 6;

  const features = [];
  if (formData.technology.includeLoginSignup) features.push('Authentication');
  if (formData.technology.includeDashboard) features.push('Dashboard');
  if (formData.technology.includeDatabase) features.push('Database');
  if (formData.technology.mobileOptimization) features.push('Mobile Optimized');

  if (features.length > 0) {
    doc.text(`Features: ${features.join(', ')}`, 20, yPosition);
    yPosition += 10;
  }

  // Add new page for prompt
  doc.addPage();
  yPosition = 20;

  // Generated Prompt Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Generated Prompt', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const promptLines = doc.splitTextToSize(prompt, 170);
  
  // Add prompt with page breaks if needed
  for (let i = 0; i < promptLines.length; i++) {
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(promptLines[i], 20, yPosition);
    yPosition += 4;
  }

  // Save the PDF
  const fileName = `${formData.brandIdentity.projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-specification.pdf`;
  doc.save(fileName);
}

