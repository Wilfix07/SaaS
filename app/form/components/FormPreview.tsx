'use client';

import { CompleteFormData } from '@/lib/form-schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Sparkles, Layout, Palette, Image as ImageIcon, Smartphone, Tablet, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FormPreviewProps {
  formData: Partial<CompleteFormData>;
  isVisible: boolean;
  onToggle: () => void;
}

type DeviceType = 'iphone' | 'android-phone' | 'ipad' | 'android-tablet' | 'desktop';

interface DeviceConfig {
  label: string;
  width: string;
  height: string;
  icon: React.ReactNode;
  className: string;
}

const deviceConfigs: Record<DeviceType, DeviceConfig> = {
  'iphone': {
    label: 'iPhone',
    width: '375px',
    height: '667px',
    icon: <Smartphone className="h-4 w-4" />,
    className: 'rounded-[2.5rem] border-8 border-gray-900 shadow-2xl',
  },
  'android-phone': {
    label: 'Android Phone',
    width: '360px',
    height: '640px',
    icon: <Smartphone className="h-4 w-4" />,
    className: 'rounded-[1.5rem] border-4 border-gray-700 shadow-xl',
  },
  'ipad': {
    label: 'iPad',
    width: '768px',
    height: '1024px',
    icon: <Tablet className="h-4 w-4" />,
    className: 'rounded-[1rem] border-8 border-gray-900 shadow-2xl',
  },
  'android-tablet': {
    label: 'Android Tablet',
    width: '800px',
    height: '1280px',
    icon: <Tablet className="h-4 w-4" />,
    className: 'rounded-lg border-4 border-gray-700 shadow-xl',
  },
  'desktop': {
    label: 'Desktop/PC',
    width: '100%',
    height: 'auto',
    icon: <Monitor className="h-4 w-4" />,
    className: 'rounded-lg border-2 border-gray-300 shadow-lg',
  },
};

export function FormPreview({ formData, isVisible, onToggle }: FormPreviewProps) {
  const colors = formData.colorPalette || {
    primaryColor: '#2563eb',
    secondaryColor: '#38bdf8',
    backgroundColor: '#f8fafc',
    textColor: '#111827',
    bannerColor: '#2563eb',
    footerColor: '#1e293b',
  };
  const brand = formData.brandIdentity || { projectName: '', slogan: '', logo: '', logoSize: 100 };
  const images = formData.images || {};
  const design = formData.designStructure || {
    projectType: 'Landing Page',
    sectionsToInclude: ['Hero'],
    visualStyle: 'Modern',
    preferredLayout: 'Single Page',
    fontTypography: 'Inter',
    includeImageVideo: false,
  };

  const [colorKey, setColorKey] = useState(0);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [currentPage, setCurrentPage] = useState(0);

  const deviceConfig = deviceConfigs[selectedDevice];
  const sections = design.sectionsToInclude || [];
  
  // Generate pages: 'All' page first, then individual section pages
  const pages = ['All', ...sections];
  const totalPages = pages.length;
  
  // Get sections to show for current page
  const getCurrentPageSections = () => {
    if (currentPage === 0) {
      // Show all sections on "All" page
      return sections;
    }
    // Show only the selected section
    const sectionIndex = currentPage - 1;
    return sections[sectionIndex] ? [sections[sectionIndex]] : [];
  };

  const currentPageSections = getCurrentPageSections();

  // Reset to first page when sections change
  useEffect(() => {
    setCurrentPage(0);
  }, [sections.join(',')]);

  // Trigger re-render when colors change for smooth transitions
  useEffect(() => {
    setColorKey((prev) => prev + 1);
  }, [colors.primaryColor, colors.secondaryColor, colors.backgroundColor, colors.textColor, colors.bannerColor, colors.footerColor]);

  // Get typography font family
  const getTypography = () => {
    if (!design.fontTypography) return 'Inter, sans-serif';
    const font = design.fontTypography.toLowerCase();
    if (font.includes('inter')) return 'Inter, sans-serif';
    if (font.includes('roboto')) return 'Roboto, sans-serif';
    if (font.includes('poppins')) return 'Poppins, sans-serif';
    if (font.includes('montserrat')) return 'Montserrat, sans-serif';
    if (font.includes('open sans')) return 'Open Sans, sans-serif';
    return `${design.fontTypography}, sans-serif`;
  };

  // Get visual style classes
  const getVisualStyleClasses = () => {
    const style = design.visualStyle?.toLowerCase() || 'modern';
    switch (style) {
      case 'minimalist':
        return {
          card: 'border-2 border-gray-200 shadow-sm',
          button: 'rounded-none border',
          image: 'rounded-none',
        };
      case 'corporate':
        return {
          card: 'border border-gray-300 shadow-md',
          button: 'rounded-sm',
          image: 'rounded-sm',
        };
      case 'playful':
        return {
          card: 'border-2 border-dashed shadow-lg',
          button: 'rounded-full',
          image: 'rounded-full',
        };
      case 'luxury':
        return {
          card: 'border-2 border-yellow-400 shadow-2xl',
          button: 'rounded-md',
          image: 'rounded-lg',
        };
      default: // Modern
        return {
          card: 'border shadow-lg',
          button: 'rounded-lg',
          image: 'rounded-lg',
        };
    }
  };

  const styleClasses = getVisualStyleClasses();

  // Calculate logo size in pixels based on device and size multiplier
  const getLogoSize = () => {
    const logoSize = brand.logoSize || 100; // Get logo size from form data, default to 100%
    const baseSize = isMobileOrTablet ? 24 : 32; // Base size in pixels
    return (baseSize * logoSize) / 100;
  };

  if (!isVisible) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed top-20 right-4 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  // Determine max height for mobile/tablet devices
  const isMobileOrTablet = selectedDevice !== 'desktop';
  const maxHeight = isMobileOrTablet ? deviceConfig.height : 'auto';

  return (
    <motion.div
      key="preview-card"
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="sticky top-4 transition-all duration-300"
    >
      <Card className={`shadow-xl overflow-hidden ${styleClasses.card} w-full`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Sparkles className="h-4 w-4 text-primary animate-pulse flex-shrink-0" />
            <CardTitle className="text-lg font-bold flex-shrink-0">Live Preview</CardTitle>
            <div className="flex items-center gap-2 ml-4 flex-1 min-w-0">
              <Select value={selectedDevice} onValueChange={(value: DeviceType) => setSelectedDevice(value)}>
                <SelectTrigger className="h-8 text-xs w-full max-w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iphone">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-3 w-3" />
                      <span>iPhone</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="android-phone">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-3 w-3" />
                      <span>Android Phone</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ipad">
                    <div className="flex items-center gap-2">
                      <Tablet className="h-3 w-3" />
                      <span>iPad</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="android-tablet">
                    <div className="flex items-center gap-2">
                      <Tablet className="h-3 w-3" />
                      <span>Android Tablet</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="desktop">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-3 w-3" />
                      <span>Desktop/PC</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          {/* Page Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 pb-2 border-b">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1))}
                disabled={totalPages === 0}
                className="h-7 px-2 text-xs"
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-2 flex-1 justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  {pages.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        index === currentPage
                          ? 'bg-primary w-6'
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                      title={page}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {pages[currentPage]}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0))}
                disabled={totalPages === 0}
                className="h-7 px-2 text-xs"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}

          {/* Device Frame Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
            <Layout className="h-3 w-3" />
            <span>{design.preferredLayout || 'Single Page'}</span>
            <span>•</span>
            <Palette className="h-3 w-3" />
            <span>{design.visualStyle || 'Modern'}</span>
            <span>•</span>
            {deviceConfig.icon}
            <span>{deviceConfig.label}</span>
          </div>

          {/* Scrollable Device Frame Container */}
          <div 
            className="flex justify-center overflow-auto max-h-[600px] border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800"
            style={{
              scrollbarWidth: 'thin',
            }}
          >
            <motion.div
              key={`${selectedDevice}-${currentPage}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`bg-gray-100 dark:bg-gray-800 p-2 ${isMobileOrTablet ? deviceConfig.className : ''}`}
              style={{
                width: isMobileOrTablet ? deviceConfig.width : '100%',
                maxWidth: '100%',
                transformOrigin: 'top center',
              }}
            >
              {/* Mock Page Preview */}
              <motion.div
                key={`${colorKey}-${currentPage}`}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`border-2 rounded-lg overflow-hidden bg-white ${styleClasses.card}`}
                style={{
                  fontFamily: getTypography(),
                  width: '100%',
                  maxHeight: maxHeight,
                  overflowY: isMobileOrTablet ? 'auto' : 'visible',
                }}
              >
                {/* Header/Navbar */}
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: colors.bannerColor || '#2563eb',
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`${isMobileOrTablet ? 'h-12' : 'h-16'} flex items-center justify-between px-4 text-white`}
                  onMouseEnter={() => setHoveredSection('header')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <div className="flex items-center gap-3">
                    {brand.logo && (
                      <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        src={brand.logo}
                        alt="Logo"
                        className="object-contain"
                        style={{
                          width: `${getLogoSize()}px`,
                          height: `${getLogoSize()}px`,
                        }}
                      />
                    )}
                    <motion.span
                      key={brand.projectName}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`font-bold ${isMobileOrTablet ? 'text-xs' : 'text-sm'}`}
                    >
                      {brand.projectName || 'Your Project'}
                    </motion.span>
                  </div>
                  <motion.div
                    animate={{
                      scale: hoveredSection === 'header' ? 1.05 : 1,
                    }}
                    className="flex gap-2"
                  >
                    <div className={`${isMobileOrTablet ? 'w-6 h-6' : 'w-8 h-8'} rounded bg-white/20`} />
                    <div className={`${isMobileOrTablet ? 'w-6 h-6' : 'w-8 h-8'} rounded bg-white/20`} />
                  </motion.div>
                </motion.div>

                {/* Render sections based on current page */}
                <AnimatePresence mode="wait">
                  {/* Hero Section */}
                  {currentPageSections.includes('Hero') && (
                    <motion.div
                      key="hero"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="relative"
                    >
                      {images.heroImage && (
                        <motion.div
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className={`w-full ${isMobileOrTablet ? 'h-24' : 'h-32'} overflow-hidden ${styleClasses.image}`}
                        >
                          <img
                            src={images.heroImage}
                            alt="Hero"
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      )}
                      {!images.heroImage && (
                        <div
                          className={`${isMobileOrTablet ? 'h-20' : 'h-24'} flex items-center justify-center`}
                          style={{
                            backgroundColor: colors.primaryColor + '20',
                            color: colors.primaryColor,
                          }}
                        >
                          <ImageIcon className={`${isMobileOrTablet ? 'h-5 w-5' : 'h-6 w-6'}`} />
                        </div>
                      )}
                      {brand.slogan && (
                        <motion.p
                          key={brand.slogan}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`${isMobileOrTablet ? 'text-[10px]' : 'text-xs'} italic text-center p-2`}
                          style={{ color: colors.textColor }}
                        >
                          "{brand.slogan}"
                        </motion.p>
                                            )}
                    </motion.div>
                  )}

                  {/* Content Area */}
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: colors.backgroundColor || '#f8fafc',
                    color: colors.textColor || '#111827',
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`${isMobileOrTablet ? 'p-2 space-y-2' : 'p-3 space-y-3'} min-h-[200px]`}
                >
                  {/* Features Section */}
                  {currentPageSections.includes('Features') && images.featureImages && images.featureImages.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <h3 className={`${isMobileOrTablet ? 'text-[10px]' : 'text-xs'} font-semibold`}>Features</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {images.featureImages.slice(0, 4).map((img, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ scale: 1.05 }}
                            className={`aspect-square rounded overflow-hidden cursor-pointer ${styleClasses.image}`}
                          >
                            <img
                              src={img}
                              alt={`Feature ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                                     {/* About Section */}
                   {currentPageSections.includes('About') && images.aboutImage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <h3 className={`${isMobileOrTablet ? 'text-[10px]' : 'text-xs'} font-semibold`}>About</h3>
                      <div className={`w-full ${isMobileOrTablet ? 'h-16' : 'h-20'} rounded overflow-hidden ${styleClasses.image}`}>
                        <img
                          src={images.aboutImage}
                          alt="About"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* CTA Section */}
                  {currentPageSections.includes('CTA') && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      {images.ctaBackground && (
                        <div className={`relative w-full ${isMobileOrTablet ? 'h-12' : 'h-16'} rounded overflow-hidden ${styleClasses.image}`}>
                          <img
                            src={images.ctaBackground}
                            alt="CTA Background"
                            className="w-full h-full object-cover opacity-50"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`${isMobileOrTablet ? 'px-2 py-1 text-[10px]' : 'px-4 py-2 text-xs'} text-white font-medium ${styleClasses.button} shadow-lg`}
                              style={{
                                backgroundColor: colors.primaryColor || '#2563eb',
                              }}
                            >
                              Call to Action
                            </motion.button>
                          </div>
                        </div>
                      )}
                      {!images.ctaBackground && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-full ${isMobileOrTablet ? 'py-1.5 px-2 text-[10px]' : 'py-2 px-3 text-xs'} text-white font-medium ${styleClasses.button}`}
                          style={{
                            backgroundColor: colors.primaryColor || '#2563eb',
                          }}
                        >
                          Call to Action
                        </motion.button>
                      )}
                    </motion.div>
                  )}

                  {/* Primary & Secondary Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 ${isMobileOrTablet ? 'py-1.5 px-2 text-[10px]' : 'py-2 px-3 text-xs'} text-white font-medium ${styleClasses.button} transition-all`}
                      style={{
                        backgroundColor: colors.primaryColor || '#2563eb',
                      }}
                    >
                      Primary Action
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 ${isMobileOrTablet ? 'py-1.5 px-2 text-[10px]' : 'py-2 px-3 text-xs'} text-white font-medium ${styleClasses.button} transition-all`}
                      style={{
                        backgroundColor: colors.secondaryColor || '#38bdf8',
                      }}
                    >
                      Secondary
                    </motion.button>
                  </div>

                  {/* Empty State */}
                  {currentPageSections.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex flex-col items-center justify-center ${isMobileOrTablet ? 'h-24' : 'h-32'} text-muted-foreground`}
                    >
                      <Layout className={`${isMobileOrTablet ? 'h-6 w-6' : 'h-8 w-8'} mb-2`} />
                      <p className={`${isMobileOrTablet ? 'text-[10px]' : 'text-xs'} text-center`}>No sections to display</p>
                    </motion.div>
                  )}
                </motion.div>
                </AnimatePresence>

                {/* Footer - only show on "All" page or last section */}
                {(currentPage === 0 || currentPage === totalPages - 1) && (
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: colors.footerColor || '#1e293b',
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`${isMobileOrTablet ? 'h-10' : 'h-12'} flex items-center justify-center text-white ${isMobileOrTablet ? 'text-[10px]' : 'text-xs'} px-4`}
                >
                  {images.footerLogo ? (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={images.footerLogo}
                      alt="Footer Logo"
                      className={`${isMobileOrTablet ? 'h-5' : 'h-6'} object-contain`}
                    />
                                      ) : (
                      <span>Footer Section</span>
                    )}
                  </motion.div>
                )}
                </motion.div>
            </motion.div>
          </div>

          {/* Color Palette Display */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <Palette className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs font-semibold">Color Palette</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.entries(colors).map(([name, color], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  className="space-y-1 cursor-pointer group"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: color as string,
                    }}
                    transition={{ duration: 0.4 }}
                    className={`w-full h-10 rounded border-2 ${styleClasses.image} shadow-sm group-hover:shadow-md transition-shadow`}
                  />
                  <p className="text-xs truncate text-muted-foreground group-hover:text-foreground transition-colors">
                    {name.replace('Color', '').replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Typography Preview */}
          {design.fontTypography && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-2 border-t space-y-1"
            >
              <p className="text-xs font-semibold">Typography</p>
              <p
                className="text-xs"
                style={{
                  fontFamily: getTypography(),
                  color: colors.textColor,
                }}
              >
                {design.fontTypography} — The quick brown fox jumps over the lazy dog
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

